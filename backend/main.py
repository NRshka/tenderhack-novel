import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch
import numpy as np

from models.database import DB
from models.good import SKU, Region, SupplimentRegions, Category, Suppliments
from predictors import MergedModel
from sqlalchemy import text


logger = logging.getLogger(__name__)

logger.info('Connecting to Elasticsearch...')
es = Elasticsearch(
    host='192.168.12.207',
    scheme='http'
)
logger.info('Loading a predictor model...')
predictor = MergedModel()
ALL_REGIONS = "Все регионы"


app = FastAPI()
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


async def get_relevant(region_name):
    region_id = DB.session.query(
        Region.id
    ).filter(
        Region.name.in_((region_name, ALL_REGIONS))
    ).first()

    sku_s = DB.session.query(
        SKU
    ).join(
        SupplimentRegions
    ).filter(
        SupplimentRegions.region.in_(region_id)
    ).filter(
        SKU.cost != float('NaN')
    )

    return sku_s


async def get_top(region_name, by_column, limit):
    if region_name == "none":
        region_name = ALL_REGIONS

    sku_s = await get_relevant(region_name)

    sku_s = sku_s.order_by(
        by_column
    ).limit(limit)

    return [
        {
            "name": sku.name,
            "cost": round(sku.cost, 2),
            "id": sku.sku_id
        }
        for sku in sku_s
    ]


@app.get("/top_views/{region_name}/{count_items}")
async def top_views(region_name: str, count_items: int):
    return await get_top(region_name, SKU.views.desc(), count_items)


@app.get("/top_orders/{region_name}/{count_items}")
async def top_orders(region_name: str, count_items: int):
    return await get_top(region_name, SKU.num_contracts.desc(), count_items)


@app.get("/product/{product_id}")
def get_product(product_id):
    result = DB.session.query(
        SKU, Category.cat_name, Region.name
    ).join(
        Category
    ).join(
        SupplimentRegions
    ).join(
        Region
    ).filter(
        SKU.sku_id == product_id
    ).all()

    product = result[0][0]
    category_name = result[0][1]
    regions = [res[2] for res in result]

    return {
        "name": product.name,
        "category": category_name,
        "regions": regions,
        "cost": round(product.cost, 2) if not np.isnan(product.cost) else 'Нет в наличии'
    }


@app.get("/same_supp/{region_name}/{product_id}")
async def same_supplier(region_name: str, product_id: int):
    import pdb
    pdb.set_trace()
    sup_id = DB.session.query(
        Suppliments.supplier_id
    ).filter(
        Suppliments.sku_id == product_id
    ).first()

    sku_s = DB.session.query(
        SKU
    ).join(
        Suppliments
    ).filter(
        Suppliments.supplier_id == sup_id
    ).all()

    return return_small_product_info(sku_s)


async def get_same_category(region_name: str, good_id: int):
    result = DB.session.query(
        Category.id, Category.cat_name, SKU.cost
    ).join(
        SKU
    ).filter(
        SKU.sku_id == good_id
    ).all()

    relevant = (await get_relevant(region_name)).filter(
        SKU.category == result[0][0]
    ).filter(SKU.sku_id != good_id)

    return relevant, result


def return_small_product_info(entries):
    return [
        {
            "name": product.name,
            "cost": round(product.cost, 2),
            "id": product.sku_id
        }
        for product in entries
    ]


@app.get("/same_close/{region_name}/{good_id}")
async def get_close(region_name: str, good_id: int):
    relevant, result = await get_same_category(region_name, good_id)

    nearest_by_price = relevant.order_by(
        text(f'abs(sku_tab.cost - {result[0][-1]})')
    ).limit(
        10
    ).all()

    return return_small_product_info(nearest_by_price)


@app.get("/cheapest/{region_name}/{good_id}")
async def get_cheapest(region_name: str, good_id: int):
    relevant, _ = await get_same_category(region_name, good_id)
    cheapest = relevant.order_by(SKU.cost.asc()).limit(10).all()

    return return_small_product_info(cheapest)


@app.get("/recom/{region_name}/{good_id}")
async def get_recomendations(region_name: str, good_id: int):
    row_id = DB.session.query(SKU.id).filter(SKU.sku_id == good_id).first()
    predictions = predictor.predict(row_id[0])
    recommendations = [int(pred[0]) for pred in predictions]

    relevant_sku_s = await get_relevant(region_name)
    relevant_sku_s = relevant_sku_s.filter(SKU.id.in_(recommendations)).all()

    return return_small_product_info(relevant_sku_s)


@app.get("/search/{phrase}")
def search_recomendations(phrase: str):
    res = es.search(index="sku", body={"query": {"query_string": {"query": phrase}}})
    data = [
        {
            'name': item['_source']['name'],
            'value': item['_source']['sku_id']
         }
        for item, _ in zip(res['hits']['hits'], range(100))
    ]
    return data


@app.get("/city")
def get_available_cities():
    return [
        {'name': 'Екатеринбург', 'value': 'ekb'},
        {'name': 'Новосибирск', 'value': 'nsk'}
    ]
