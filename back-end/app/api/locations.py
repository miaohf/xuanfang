# -*- coding: utf-8 -*-
import requests
from urllib.parse import urlencode #python3
#from urllib import urlencode #python2

params = urlencode({'ip':'125.123.153.12','datatype':'jsonp','callback':'find'})
url = 'http://api.ip138.com/query/?'+params
headers = {"token":"8594766483a2d65d76804906dd1a1c6a"}#token为示例
res = requests.get(url, headers = {"token":"13ccbd7d6548a21d1cd8d5b2068fdd5d"})
print(res.text)