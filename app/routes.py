from quart import render_template, send_from_directory, request

from app import app
from app.wt_storage import WakaTime


@app.route('/')
@app.route('/about')
@app.route('/projects')
async def index():
    pages = {'/': 'index', '/about': 'about', '/projects': 'projects'}
    return await render_template('index.html', code_stats=await WakaTime().format_data(), page=pages[request.path])


@app.route('/favicon.ico')
async def send_favicon():
    return await send_from_directory('app/static/meta', 'favicon.ico')


@app.route('/static/<path:path>')
async def send_static(path):
    return await send_from_directory('app/static', path)


@app.route('/sw.js')
async def send_service_worker():
    return await send_from_directory('app/static', 'js/sw.js')


@app.route('/site.webmanifest')
async def send_manifest():
    return await send_from_directory('app/static', 'meta/site.webmanifest')
