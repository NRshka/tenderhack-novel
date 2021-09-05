"""Модели используемых реляционных таблиц"""
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, Float
from sqlalchemy.dialects.postgresql import JSONB
from .database import Base


class Category(Base):
    __tablename__ = "category"
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    cat_name = Column('name', String)


class Region(Base):
    __tablename__ = "region"
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    name = Column('name', String, nullable=False)


class Supplier(Base):
    __tablename__ = "supplier"
    id = Column('id', Integer, primary_key=True)
    name = Column('name', String)
    inn = Column('inn', String)


class SKU(Base):
    __tablename__ = 'sku_tab'
    id = Column('id', Integer, primary_key=True)
    sku_id = Column('sku_id', Integer, unique=True)
    name = Column('name', String)
    category = Column('category', Integer, ForeignKey('category.id'))
    description = Column('description', String, nullable=True)
    specifications = Column('spec', JSONB)
    num_contracts = Column('contracts', Integer)
    origin_country = Column('origin', String)
    views = Column('views', Integer)
    kpgz_id = Column('kpgz_id', Integer)
    kpgz_code = Column('kpgz_code', String)
    model = Column('model', String)
    cost = Column('cost', Float)


class SupplimentRegions(Base):
    __tablename__ = "sup_reg"
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    sku_id = Column('sku_id', Integer, ForeignKey('sku_tab.sku_id'))
    region = Column('region_id', Integer, ForeignKey('region.id'))


class Suppliments(Base):
    __tablename__ = 'suppliments'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    sku_id = Column('sku_id', Integer, ForeignKey('sku_tab.sku_id'))
    supplier_id = Column('supplier_id', Integer, ForeignKey('supplier.id'))
