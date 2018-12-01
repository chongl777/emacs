import os
import json
from six import iteritems

from flask import redirect, url_for, render_template
from flask import Blueprint, request
from flask_login import login_required
import pandas as pd


from app_template import create_app, InvalidUsage
from config import Config
from sqlutil.engines import engine

import impl_compliance


config = Config()
# config.SERVER_NAME = "http://10.92.1.8/"
app = create_app(__name__, config)
# app.config['APPLICATION_ROOT'] = '/test/'
bp = Blueprint(
    'app_compliance', __name__,
    template_folder=os.path.dirname(
        os.path.abspath(__file__))+"/../website/static",
    static_folder=os.path.dirname(
        os.path.abspath(__file__))+"/../website/static")


@app.route('/index')
@login_required
def index():
    # import pdb;pdb.set_trace()
    return render_template('index.html')


@bp.route('/main')
@login_required
def main():

    # with open('../website/static/compliance/main.html', 'r') as f:
    #     return f.read()
    return render_template('compliance/main.html', title="TEST Compliance")


@bp.route('/search_fund')
def search_fund():
    text = request.args['text']
    with engine.connect() as con:
        data = pd.read_sql(
            """
            select [Fund Description] as value, [Fund ID] as id
            from [dbo].[FundMeta]
            where [Fund Description] like '%{text}%'
            """.format(text=text), con)
    res = [json.dumps(x) for x in data.to_dict(orient='records')]

    return json.dumps(res)


@bp.route('/search_snapshot', methods=['POST'])
def search_snapshot():

    inputs = {k: v for k, v in iteritems(request.form)}

    with engine.connect() as con:
        try:
            res = impl_compliance.search_snapshot(
                con=con, **inputs)
            import time
            time.sleep(3)
        except Exception as e:
            raise InvalidUsage("something is wrong!")
    return json.dumps(res)


app.register_blueprint(bp, url_prefix="/compliance")


if __name__ == '__main__':
    # api = Flask('__TEST__')
    # api.debug = True
    # api.register_blueprint(app, url_prefix='/sp_analytic_svc')
    # from werkzeug.wsgi import DispatcherMiddleware
    # app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    #     '/sp_analytic_svc': app})
    app.debug = True
    # app.config['REMEMBER_COOKIE_DOMAIN'] = '.10.92.1.8'
    # app.config["APPLICATION_ROOT"] = "/sp_analytic_svc"
    app.run(host='0.0.0.0', port=9991, threaded=True)
    # app.run(host='0.0.0.0', port=5550, processes=2)
    # http://192.168.168.6:9991/pf_analytic/pf_risk_dashboard
