

def search_snapshot(
        fundId, as_of_date, retain, cost_basis,
        date_basis, comments,
        con, *args, **kargs):

    data = con.execute(
        """
        EXEC dbo.dummyProc @Fundid = %s,@Asofdate = %s
        """, (fundId, as_of_date))
    res = data.fetchall()[0][0]
    return res
