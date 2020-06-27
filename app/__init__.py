import logging
import os
from logging.handlers import RotatingFileHandler

from git import InvalidGitRepositoryError, Repo
from quart import Quart

from app.utils import check_create
from config import Config

app: Quart = Quart(__name__, static_folder=None)
app.config.from_object(Config)

# Configure assets
try:
    git = Repo(os.getcwd())
    GIT_ENABLED = True
except InvalidGitRepositoryError:
    GIT_ENABLED = False
assets_version = git.head.commit.hexsha[:7] if GIT_ENABLED else 6
JS_ASSETS = [('js/jquery-3.5.1.min.js', 1), ('js/particles.min.js', 1), ('js/twemoji.min.js', 1),
             ('js/index.js', assets_version)]
CSS_ASSETS = [('css/fira_code.css', 1), ('css/index.css', assets_version)]
app.jinja_env.globals.update(CSS_ASSETS=CSS_ASSETS)
app.jinja_env.globals.update(JS_ASSETS=JS_ASSETS)

# Set up logging
check_create('logs')
file_handler = RotatingFileHandler('logs/app.log', maxBytes=1024 * 1024, backupCount=10)
file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
file_handler.setLevel(logging.INFO if not app.debug else logging.DEBUG)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

from app import routes

app.logger.info('App started!')
