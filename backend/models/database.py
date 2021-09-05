"""Содержит инициализацию движка бд и подключение к субд,
а так же служебные функции и классы"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# this class should be a singleton
Base = declarative_base()


class DB:
    engine = create_engine('postgresql+psycopg2://postgres:raeShah4@localhost/tender')
    conn = engine.connect()
    session_builder = sessionmaker(Base)
    session_builder.configure(bind=engine)
    session = session_builder()
