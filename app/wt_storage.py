import asyncio
import base64
import json
import os
from asyncio import Lock
from time import time

import requests

from app import app
from app.utils import SingletonMeta


class WakaTime(metaclass=SingletonMeta):
    lock: Lock

    def __init__(self):
        self.lock = Lock()

    @property
    def last_update(self):
        if not os.path.isfile('last_data_update.txt'):
            return 0
        with open('last_data_update.txt', 'r') as f:
            data = float(f.read().strip(' \n\r'))
        return data

    @last_update.setter
    def last_update(self, val: int):
        with open('last_data_update.txt', 'w') as f:
            f.write(str(val))

    @property
    def languages(self):
        if not os.path.isfile('languages.json'):
            return []
        with open('languages.json', 'r') as f:
            data = json.load(f)
        return data

    @languages.setter
    def languages(self, val: list):
        with open('languages.json', 'w') as f:
            json.dump(val, f)

    async def send_request(self, url):
        return json.loads(requests.get(url, headers={
            'Authorization': 'Basic ' + base64.b64encode(app.config['WAKATIME_KEY'].encode()).decode()}).text)

    async def update(self):
        await self.lock.acquire()
        if time() - self.last_update > 60 * 60 * 2:
            self.languages = (await self.send_request('https://wakatime.com/api/v1/users/current/stats/last_7_days'))['data']['languages']
            self.languages = sorted(self.languages, key=lambda x: x['total_seconds'], reverse=True)
            self.last_update = time()
        self.lock.release()

    async def get_data(self):
        asyncio.get_event_loop().create_task(self.update())
        return self.languages

    def get_word(self, n: int, w1, w2, w3):
        n %= 100
        if 11 <= n <= 19 or n % 10 == 0 or 5 <= n % 10 <= 9:
            return w1
        elif n % 10 == 1:
            return w2
        else:
            return w3

    async def format_data(self):
        is_first = True
        res = ''
        for i in await self.get_data():
            if not i['minutes'] and not i['hours']:
                continue
            if i['name'].lower() in ['text', 'other', 'git config']:
                continue
            if i['hours']:
                res += str(i['hours']) + ' ' + self.get_word(i['hours'], 'часов', 'час', 'часа') + (' ' if i['minutes'] else '')
            if i['minutes']:
                res += str(i['minutes']) + ' ' + self.get_word(i['minutes'], 'минут', 'минуту', 'минуты')
            if is_first:
                res += ' писал'
                is_first = False
            res += ' на '
            res += i['name']
            res += ', '
        if res:
            res = res[:-2]
        return res
