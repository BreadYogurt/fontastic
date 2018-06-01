import requests
from io import BytesIO
from zipfile import ZipFile
import os

dirName = "fonts"
fontAPI = "https://google-webfonts-helper.herokuapp.com/api/fonts"
iconDir = "icons/google"

root = os.path.join(os.path.dirname(os.path.realpath(__file__)), dirName)

resp = requests.get(fontAPI)
if resp.status_code != 200:
    raise ApiError('GET /api/fonts {}'.format(resp.status_code))

googleIconsZip = requests.get("https://github.com/google/material-design-icons/archive/master.zip")
with ZipFile(BytesIO(googleIconsZip.content)) as iconZip:
    with open('icons/google/MaterialIcons-Regular.woff2', 'wb') as f:
        f.write(iconZip.read('material-design-icons-master/iconfont/MaterialIcons-Regular.woff2'))

os.mkdir(root)

for font in resp.json():
    fontDir = os.path.join(root, font['id'])
    os.mkdir(fontDir)
    fontResp = requests.get("{}/{}?download=zip&subsets={}&formats=woff2".format(fontAPI, font['id'], ",".join(font['subsets'])))
    if fontResp.status_code != 200:
        raise ApiError('GET /api/fonts/{} {}'.format(font['id'], fontResp.status_code))
    with ZipFile(BytesIO(fontResp.content)) as fontZip:
        fontZip.extractall(path=fontDir)
    for r, d, files in os.walk(fontDir):
        for f in files:
            os.rename(os.path.join(r, f), os.path.join(r, f.rsplit('-', maxsplit=1)[1]))
    if os.path.isfile(os.path.join(fontDir, "regular.woff2")):
        os.rename(os.path.join(fontDir, "regular.woff2"), os.path.join(fontDir, "400.woff2"))
    if os.path.isfile(os.path.join(fontDir, "italic.woff2")):
        os.rename(os.path.join(fontDir, "italic.woff2"), os.path.join(fontDir, "400italic.woff2"))
