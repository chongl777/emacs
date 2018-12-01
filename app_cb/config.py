import os
from sqlutil.engines import engine


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = engine.url
    SQLALCHEMY_POOL_RECYCLE = 360
    AUTHADDR = os.environ.get('AUTHADDR')


if __name__ == '__main__':
    import pandas as pd
    with engine.connect() as con:
        data = pd.read_sql('''
        select top 1000 *
        from [dbo].[factsheets_narratives]
        ''', con)
