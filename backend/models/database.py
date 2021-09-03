"""Содержит инициализацию движка бд и подключение к субд,
а так же служебные функции и классы"""
from sqlalchemy.ext import declarative_base


Base = declarative_base()
