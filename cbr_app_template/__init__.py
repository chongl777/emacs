import os

from flask import Flask, jsonify, send_from_directory
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager


bootstrap = Bootstrap()
this_folder = os.path.dirname(os.path.abspath(__file__))
db = SQLAlchemy()
loginMgmr = LoginManager()


@loginMgmr.user_loader
def load_user(user_id):
    from .auth.models import User
    return User.query.get(int(user_id))


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def create_app(name, config):
    app = Flask(
        name, template_folder=this_folder+"/templates",
        static_folder=this_folder+"/static")
    app.config.from_object(config)

    db.init_app(app)
    loginMgmr.init_app(app)
    loginMgmr.login_view = app.config['AUTHADDR'] + '/login'
    bootstrap.init_app(app)

    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(
            os.path.join(this_folder, 'static/images'),
            'favicon.ico', mimetype='image/vnd.microsoft.icon')

    return app
