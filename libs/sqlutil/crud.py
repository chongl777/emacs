from functools import reduce
from sqlalchemy.exc import IntegrityError
from sqlalchemy import (
    Column, MetaData, Integer,
    String, Table, create_engine, ForeignKey,)
from sqlalchemy.orm import (
    scoped_session, sessionmaker, mapper,
    relation, clear_mappers)


class CRUD(object):
    def __init__(self, engine):
        self.engine = engine
        self.Session = scoped_session(
            sessionmaker(bind=engine))

    def update_record(self, tbl, schema, old, new):

        try:
            class TblCls(object):
                pass

            session = self.Session()
            tblObj = Table(
                tbl,
                MetaData(), schema=schema,
                autoload=True, autoload_with=self.engine)

            mapper(TblCls, tblObj)

            idx = reduce(
                lambda x, y: x & y,
                [tblObj.c[x] == old[x] for x,
                 _ in tblObj.c.items() if x in old])

            record = session.query(TblCls).filter(idx).first()
            # session.add(record)

            for x, _ in tblObj.c.items():
                if x in new:
                    setattr(record, x, new[x])

            session.commit()

        except IntegrityError as e:
            session.rollback()
            session.close()
            raise(e)
        except Exception as e:
            session.rollback()
            session.close()
            raise(e)
        # finally:
        #     clear_mappers()

    def create_record(self, tbl, schema, new):

        try:
            class TblCls(object):
                pass

            session = self.Session()
            tblObj = Table(
                tbl,
                MetaData(), schema=schema,
                autoload=True, autoload_with=self.engine)

            mapper(TblCls, tblObj)

            record = TblCls()
            # session.add(record)

            for x, _ in tblObj.c.items():
                if x in new:
                    setattr(record, x, new[x])

            session.add(record)
            session.commit()

        except IntegrityError as e:
            session.rollback()
            session.close()
            raise(e)
        except Exception as e:
            session.rollback()
            session.close()
            raise(e)
        # finally:
        #     clear_mappers()

    def insert_record(self, tbl, schema, rc):

        try:

            session = self.Session()
            tbl = Table(
                tbl,
                MetaData(), schema=schema,
                autoload=True, autoload_with=self.engine)

            ins = tbl.insert().values(rc)
            self.engine.execute(ins)

            session.commit()

        except IntegrityError as e:
            session.rollback()
            session.close()
            raise(e)
        except Exception as e:
            session.rollback()
            session.close()
            raise(e)
        # finally:
        #     clear_mappers()

    def delete_record(self, tbl, schema, records):

        try:
            class TblCls(object):
                pass

            session = self.Session()
            tblObj = Table(
                tbl,
                MetaData(), schema=schema,
                autoload=True, autoload_with=self.engine)

            mapper(TblCls, tblObj)

            # session.add(record)
            for rc in records:
                idx = reduce(
                    lambda x, y: x & y,
                    [tblObj.c[x] == rc[x] for
                     x, _ in tblObj.c.items() if x in rc])
                session.query(TblCls).filter(idx).delete()

            session.commit()

        except IntegrityError as e:
            session.rollback()
            session.close()
            raise(e)
        except Exception as e:
            session.rollback()
            session.close()
            raise(e)
        # finally:
        #     clear_mappers()

    def query_record(self, tbl, schema, **kargs):

        try:
            class TblCls(object):
                pass

            session = self.Session()
            tblObj = Table(
                tbl,
                MetaData(), schema=schema,
                autoload=True, autoload_with=self.engine)

            mapper(TblCls, tblObj)

            # session.add(record)
            return session.query(TblCls).filter_by(**kargs).first()

        except Exception as e:
            session.close()
            raise(e)
        # finally:
        #     clear_mappers()


if __name__ == "__main__":
    pass

    # trading_records = securities_holding_periods(52967285)
    # aa = security_returns([3, 4], 'px', pd.to_datetime('4/1/2017'), 10)
