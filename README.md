### 1. 获取当前城市，城市列表，热门城市

    type: GET

    url: /city/target?type=guess

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| type | N | String | 可选 [guess, cityHot, cityGroup] |

> tip: 不传type参数时，默认为guess

```javascript
{
    "status": 1,
    "data": {
        "id": 3,
        "name": "北京",
        "abbr": "BJ",
        "area_code": "010",
        "sort": 2000,
        "latitude": 39.90469,
        "longitude": 116.407173,
        "is_map": true,
        "pinyin": "beijing"
    }
}
```


### 2. 根据id获取城市信息

    type: GET

    url: /city/getCityById/:id

| 参数 | 必选 | 类型 |
| -- | -- | -- |
| id | Y | Int |

```javascript
{
    "status": 1,
    "data": {
        "id": 244,
        "name": "宝鸡",
        "abbr": "BJ",
        "area_code": "0917",
        "sort": 2000,
        "latitude": 34.361938,
        "longitude": 107.23732,
        "is_map": true,
        "pinyin": "baoji"
    }
}
```


### 3. 搜索地址

    type: GET

    url: /city/search?cityId=244&keyword=魏家凉皮

| 参数 | 必选 | 类型 |
| -- | -- | -- |
| cityId | Y | Int |
| keyword | Y | String |

```javascript
{
    "status": 1,
    "data": [
        {
            "id": "887637304642591005",
            "title": "魏家凉皮(宝鸡儿童医院店)",
            "address": "陕西省宝鸡市渭滨区经二路天同国际A座1层(儿童医院西隔壁)",
            "tel": "0917-3853996",
            "category": "美食:小吃快餐",
            "type": 0,
            "location": {
                "lat": 34.37088,
                "lng": 107.15444
            },
            "ad_info": {
                "adcode": 610302,
                "province": "陕西省",
                "city": "宝鸡市",
                "district": "渭滨区"
            }
        }
    ]
}
```


### 4. 根据经纬度详细定位

    type: GET

    url: /city/getPosiByGeo?lat=34.37088&lng=106.15444

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| lat | Y | Number | 纬度 |
| lng | Y | Number | 经度 |

```javascript
{
    "status": 1,
    "data": {
        "address": "甘肃省天水市麦积区",
        "ad_info": {
            "nation_code": "156",
            "adcode": "620503",
            "city_code": "156620500",
            "name": "中国,甘肃省,天水市,麦积区",
            "location": {
                "lat": 34.37088,
                "lng": 106.154442
            },
            "nation": "中国",
            "province": "甘肃省",
            "city": "天水市",
            "district": "麦积区"
        }
    }
}
```


### 5. 获取食品分类列表

    type: GET

    url: /shopping/category/all

```javascript
{
    "status": 1,
    "data": [
        {
            "id": 15,
            "is_in_serving": true,
            "description": "附近美食一网打尽",
            "title": "美食",
            "link": "url...",
            "image_url": "/b/7e/d1890cf73ae6f2adb97caa39de7fcjpeg.jpeg",
            "icon_url": "",
            "title_color": ""
        }
    ]
}
```











