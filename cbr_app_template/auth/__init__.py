import os

from flask import Blueprint, flash
from flask import render_template, redirect, url_for, request
from flask_login import current_user, login_user, logout_user
# from flask_login import login_required
from werkzeug.urls import url_parse
from .models import User
from .forms import LoginForm

bp = Blueprint(
    'auth', __name__,
    template_folder=os.path.dirname(os.path.abspath(__file__))+"/templates/",
    static_folder=os.path.dirname(os.path.abspath(__file__))+"/../static")


@bp.route('/login', methods=['GET', 'POST'])
def login():

    if current_user.is_authenticated:
        return redirect(url_for('index', _external=True))

    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password', category="login-failed")
            return redirect(url_for('auth.login', _external=True))

        # flash(user.initial, category="login-name")
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')

        # if not next_page or url_parse(next_page).netloc != '':
        if not next_page:
            next_page = url_for('index', _external=True)
        return redirect(next_page)

    return render_template(
        'login.html', title='Sign In', form=form)


@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index', _external=True))


@bp.route('/user')
def user():
    return render_template(
        'profile.html', title='Profile')
