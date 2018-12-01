from sqlalchemy import create_engine
# engine = create_engine("mssql+pymssql://@WFDB01/Westfield")
DEFAULT_POOL_RECYCLE = 360

engine = create_engine(
    # "mssql+pymssql://wfiwebsvc:Westfieldbull2017!" +
    "mssql+pymssql://@MACPRO/Westfield",
    pool_size=40,
    pool_recycle=DEFAULT_POOL_RECYCLE)


if __name__ == '__main__':
    import pandas as pd
    import pymssql
    # conn = pymssql.connect(
    #     'wfisql01.database.windows.net',
    #     'wfadmin@wfisql01.database.windows.net',
    #     'dG3FQUlfFjQgtA2D', "Westfield")
    # data = pd.read_sql(
    #     '''
    #     select top 1000 *
    #     from sec.tbl_securities_price_history
    #     ''', conn)

    with engine.connect() as con:
        data = pd.read_sql(
            '''
            select top 1000 *
            from [dbo].[factsheets_narratives]
            ''', con)
