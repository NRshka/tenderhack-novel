import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import ShowMore from 'react-show-more-list';

const LongList = ({ listItems }) => (
    <ShowMore
      items={listItems}
      by={5}
    >
      {({
        current,
        onMore,
      }) => (
        <React.Fragment>
          <ul>
            {current.map(item => (
              <li
                key={item.id}
              >
                {item.label}
              </li>
            ))}
          </ul>
          <button
            className="bargaining"
            style={{
                fontWeight: 100,
                boxShadow: "",
                fontSize: 10,
                padding: 5
            }}
            disabled={!onMore}
            onClick={() => { if (!!onMore) onMore(); }}
          >
            more
          </button>
        </React.Fragment>
      )}
    </ShowMore>
  );

function FetchCard(productId) {
    let url = "http://localhost:8000/product/" + String(productId);
    const [data, setData] = useState([]);
    
    React.useEffect(() => {
        const fetchData = async () => {

        const res = await fetch(url);
        const json = await res.json();
        setData(json);
        };
        fetchData();
      }, []);

      return data;
}

const Info = () => {
  let { productId } = useParams();
  let response = FetchCard(productId);

  const shoeName = (
    <div className="shoeName">
      <div>
        <h1 className="big">{ response.name }</h1>
      </div>
      <h3 className="small">{ response.category }</h3>
    </div>
  );

  const description = (
    <div className="description">
      <h3 className="title">Регионы поставки:</h3>
      <p className="text">
          {
              response.regions && 
                <LongList
                    listItems={response.regions.map((item, index) => {
                        return {
                            id: index,
                            label: item
                        };
                    })}
                />
          }
      </p>
    </div>
  );

  const BuySection = (
    <div className="buy-price">
    <div className="price">
        <i><h3>{response.cost} руб.</h3></i>
      </div>
      <br/>
      <a href="/#" className="buy">
        <i className="fa-shopping-cart" style={{fontSize: 8}}></i>Добавить в корзину
      </a>
      
    </div>
  );

  return (
    <div className="infoPart">
      {shoeName}
      {description}
      {BuySection}
    </div>
  );
};

export default Info;
