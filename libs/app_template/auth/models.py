from .. import db

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from office365.runtime.auth.authentication_context import AuthenticationContext


def check_office_365_password(username, password):
    ctx_auth = AuthenticationContext(
        url="https://westfieldinvestmentllc.sharepoint.com/")
    token = ctx_auth.acquire_token_for_user(
        username=username,
        password=password)

    if token:
        return True
    elif "AADSTS50076" in ctx_auth.provider.response.text:
        return True

    return False


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # def check_password(self, password):
    #     return check_password_hash(self.password_hash, password)

    def check_password(self, password):
        return check_office_365_password(self.email, password)

    @property
    def initial(self):
        ans = self.username.split(' ')
        if len(ans) >= 2:
            return (ans[0][0]+ans[-1][0]).upper()
        else:
            return self.username[:2].upper()

    def __repr__(self):
        return '<User {}>'.format(self.username)


# @loginMgmr.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))
