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

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Int | 城市id |

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

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| cityId | Y | Int | 城市id |
| keyword | Y | String | 关键词 |

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


### 5. 获取商品分类列表

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


### 6. 获取商铺列表

    type: POST

    url: /shopping/shop/getList

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| category_id | Y | Number | 种类id |
| latitude | Y | Number | 纬度 |
| longitude | Y | Number | 经度 |
| offset | N | Number | 索引(从0开始) |
| limit | N | Number | 返回条数 |
| order_by | N | Number | 见tip |
| delivery_mode | N | Array | 支持的配送方式id |
| activities | N | Array | 支持的配送方式id |

> tip: order_by类型
1 起送价
2 评分
3 销量
4 配送距离
5 配送时间


```javascript
{
    "status": 1,
    "data": [
        {
            "description": "客户您好，欢迎光临！",
            "promotion_info": "欢迎光临，用餐高峰请提前下单，谢谢",
            "rating": 2.5,
            "rating_count": 0,
            "recent_order_num": 72,
            "status": 0,
            "id": 495,
            "name": "Hi辣朝阳大悦城店",
            "address": "北京市朝阳区朝阳北路101号朝阳大悦城7楼15B",
            "phone": "010-85511488",
            "latitude": 39.924699,
            "longitude": 116.518312,
            "category_id": 15,
            "image_path": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "float_delivery_fee": 10,
            "float_minimum_order_amount": 58,
            "startTime": "8:30",
            "endTime": "21:30",
            "business_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "catering_service_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "labels": [],
            "delivery_mode": [
                {
                    "_id": "5c19e06ad8d55f051f09761b",
                    "id": 2,
                    "color": "fe4070",
                    "is_solid": true,
                    "text": "京东到家"
                }
            ],
            "activities": [
                {
                    "_id": "5c19e06ad8d55f051f09761e",
                    "id": 9,
                    "keyword": "网",
                    "description": "网红食品，大胆尝鲜"
                }
            ],
            "distanceText": "10.6公里",
            "distanceValue": 10613,
            "durationText": "7分钟",
            "durationValue": 397
        }
    ]
}
```


### 7. 搜索商家

    type: GET

    url: /shopping/shop/search?lng=116.37118&lat=39.83532&keyword=魏家凉皮

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| lat | Y | Number | 纬度 |
| lng | Y | Number | 经度 |
| keyword | Y | Number | 关键词 |
| cityId | N | Number | 城市id |

> tip: 为提高搜索成功率，强烈建议关键词使用精确匹配，例如：“凉皮” ===> “魏家凉皮”

```javascript
{
    "status": 1,
    "data": [
        {
            "description": "客户您好，欢迎光临！",
            "promotion_info": "欢迎光临，用餐高峰请提前下单，谢谢",
            "rating": 2.9,
            "rating_count": 4,
            "recent_order_num": 36,
            "status": 1,
            "id": 193,
            "name": "晓蕊家凉皮(石门东路店)",
            "address": "北京市朝阳区百子湾西里甲108金都杭城底商魔方公寓旁",
            "phone": 18910523776,
            "latitude": 39.900051,
            "longitude": 116.49893,
            "category_id": 288,
            "image_path": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "float_delivery_fee": 7,
            "float_minimum_order_amount": 111,
            "startTime": "8:30",
            "endTime": "21:30",
            "business_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "catering_service_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "labels": [],
            "delivery_mode": [],
            "activities": [],
            "distanceText": "17公里",
            "distanceValue": 17046,
            "durationText": "11分钟",
            "durationValue": 639
        }
    ]
}
```


### 8. 获取所有商家属性标签

    type: GET

    url: /shopping/label/all

```javascript
{
    "status": 1,
    "data": [
        {
            "id": 5,
            "description": "可使用支付宝、微信、手机QQ进行在线支付",
            "icon_color": "FF4E00",
            "icon_name": "付",
            "name": "在线支付",
            "ranking_weight": 2
        }
    ]
}
```


### 9. 获取所有配送方式

    type: GET

    url: /shopping/delivery/all

```javascript
{
    "status": 1,
    "data": [
        {
            "id": 1,
            "color": "57A9FF",
            "is_solid": true,
            "text": "蜂鸟专送"
        }
    ]
}
```


### 10. 获取所有商家活动

    type: GET

    url: /shopping/activity/all

```javascript
{
    "status": 1,
    "data": [
        {
            "id": 1,
            "keyword": "新",
            "description": "新人立减50"
        }
    ]
}
```


### 11. 获取商铺详情

    type: GET

    url: /shopping/shop/detail/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 商铺id |

```javascript
{
    "status": 1,
    "data": {
        "description": "客户您好，欢迎光临！",
        "promotion_info": "欢迎光临，用餐高峰请提前下单，谢谢",
        "rating": 3.1,
        "rating_count": 7,
        "recent_order_num": 9,
        "status": 1,
        "id": 415,
        "name": "肯德基(宣武门店)",
        "address": "北京市西城区宣武门东大街24号越秀饭店西配楼1层",
        "phone": "010-83161242; 010-83161243",
        "latitude": 39.8982,
        "longitude": 116.37509,
        "category_id": 9,
        "image_path": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
        "float_delivery_fee": 7,
        "float_minimum_order_amount": 41,
        "startTime": "8:30",
        "endTime": "21:30",
        "business_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
        "catering_service_license_image": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
        "labels": [
            {
                "_id": "5c18aa0715d1d208614d4390",
                "id": 1,
                "description": "品牌商家，值得信任",
                "icon_color": "3FBDE6",
                "icon_name": "品",
                "name": "品牌商家",
                "ranking_weight": 7
            }
        ],
        "delivery_mode": [
            {
                "_id": "5c18aa0715d1d208614d4391",
                "id": 2,
                "color": "fe4070",
                "is_solid": true,
                "text": "京东到家"
            }
        ],
        "activities": [
            {
                "_id": "5c18aa0715d1d208614d4394",
                "id": 5,
                "keyword": "满减",
                "description": "满1200减800"
            }
        ]
    }
}
```


### 12. 上传图片

    type: POST

    url: /sundry/image/upload

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| file | Y | files | 图片地址 |

```javascript
{
    "status": 1,
    "data": "img-url"
}
```


### 13. 添加商铺

    type: POST

    url: /shopping/shop/addShop

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| name | Y | String | 名称 |
| address | Y | String | 地址 |
| phone | Y | Number | 联系电话 |
| latitude | Y | Number | 纬度 |
| longitude | Y | Number | 经度 |
| category_id | Y | Number | 种类id |
| image_path | Y | String | 商铺图片链接 |
| float_delivery_fee | Y | Number | 配送费 |
| float_minimum_order_amount | Y | Number | 起送价 |
| description | N | String | 描述 |
| promotion_info | N | String | 标语 |
| startTime | N | String | 开始营业时间 |
| endTime | N | String | 打烊时间 |
| business_license_image | N | String | 营业执照 |
| catering_service_license_image | N | String | 许可证 |
| rating | N | Number | 评分 |
| rating_count | N | Number | 评论量 |
| recent_order_num | N | Number | 订单量 |
| status | N | Number | 状态 |
| labels | N | Array | 标签id |
| delivery_mode | N | Array | 配送方式id |
| activities | N | Array | 活动 |

> tip: activities格式
{
    keyword: "满减",
    description: "满100，立减80"
}

```javascript
{
    "status": 1,
    "data": "商铺添加成功"
}
```


### 14. 添加商品分类

    type: POST

    url: /shopping/menu/addMenu

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| restaurant_id | Y | Number | 商铺id |
| name | Y | String | 分类名称 |
| is_selected | Y | Boolean | 默认选中 |
| description | N | String | 描述 |

```javascript
{
    "status": 1,
    "data": "商品分类添加成功"
}
```


### 15. 添加商品

    type: POST

    url: /shopping/food/addFood

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| restaurant_id | Y | Number | 商铺id |
| menu_id | Y | Number | 分类id |
| name | Y | String | 名称 |
| image_path | Y | String | 图片链接 |
| is_multi | Y | Boolean | 是否多规格 |
| description | N | String | 描述 |
| attributes | N | Array | 属性 |
| activity | N | Array | 活动 |
| rating | N | Number | 评分 |
| rating_count | N | Number | 评论量 |
| month_sales | N | Number | 销量 |
| single_spec | Y/N | Object | 单规格必填 |
| multi_spec | Y/N | Array | 多规格必填 |

> tip:
(1) attributes格式
{
    "name": "新",
    "color": "4C9C45"
}
(2) activity格式
{
    keyword: "满减",
    description: "满100，立减80"
}
(3) single_spec格式
{
	"original_price": 9999, //原价
	"current_price": 8888, //现价
	"stock": 999 // 库存
}
(4) multi_spec格式
[{
	"original_price": 9999, //原价
	"current_price": 8888, //现价
	"label": "特大", //规格名称
	"stock": 999 // 库存
}]

```javascript
{
    "status": 1,
    "data": "商品添加成功"
}
```


### 16. 获取商品分类

    type: GET

    url: /shopping//menu/getMenu/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 店铺id |

```javascript
{
    "status": 1,
    "data": [
        {
            "is_selected": false,
            "icon_url": "http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg",
            "id": 16,
            "restaurant_id": 31,
            "name": "分类001",
            "description": "hot hot hot",
            "foods": [
                {
                    "rating": 2.5,
                    "rating_count": 6,
                    "month_sales": 23,
                    "attributes": [
                        {
                            "_id": "5c18c6bbe0e0e00c27e8e1e9",
                            "name": "新",
                            "color": "4C9C45"
                        }
                    ],
                    "activity": [
                        {
                            "_id": "5c18c6bbe0e0e00c27e8e1ea",
                            "keyword": "满减",
                            "description": "满100，立减80",
                            "id": 9425
                        }
                    ],
                    "multi_spec": [
                        {
                            "_id": "5c18c6bbe0e0e00c27e8e1ec",
                            "item_id": 421,
                            "original_price": 9999,
                            "current_price": 8888,
                            "label": "特大",
                            "stock": 999
                        }
                    ],
                    "_id": "5c18c6bbe0e0e00c27e8e1e8",
                    "id": 61,
                    "restaurant_id": 31,
                    "menu_id": 16,
                    "name": "炒韭菜01",
                    "image_path": "https://fuss10.elemecdn.com/b/73/3c5eba9f45ab42aaa23f35db2ab40jpeg.jpeg?imageMogr/format/webp/thumbnail/!140x140r/gravity/Center/crop/140x140/",
                    "is_multi": true,
                    "description": "很好喝的哦"
                }
            ]
        }
    ]
}
```


### 17. 获取评价信息

    type: GET

    url: /shopping/rate/getRatings/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 店铺id |

```javascript
{
    "status": 1,
    "data": [
        {
            "avatar": "",
            "highlights": [],
            "tags": [],
            "username": "4*******b",
            "item_ratings": [
                {
                    "image_hash": "dc864033625905f0a15a2d181d53a425jpeg",
                    "is_valid": 1,
                    "_id": "5c18e9251387630e5466df36",
                    "food_id": 508807792,
                    "food_name": "超级至尊比萨-铁盘"
                },
                {
                    "image_hash": "074e0e203f613deff4e456c31e4177d1jpeg",
                    "is_valid": 1,
                    "_id": "5c18e9251387630e5466df35",
                    "food_id": 508808743,
                    "food_name": "韩式浓情风味鸡（标准份）"
                }
            ],
            "_id": "5c18e9251387630e5466df34",
            "rated_at": "2017-02-10",
            "rating_star": 5,
            "rating_text": "",
            "time_spent_desc": "按时送达"
        }
    ]
}
```


### 18. 获取评价分数

    type: GET

    url: /shopping/rate/getScores/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 店铺id |

```javascript
{
    "status": 1,
    "data": {
        "compare_rating": 0.76869,
        "deliver_time": 40,
        "food_score": 4.76378,
        "order_rating_amount": 473,
        "overall_score": 4.72836,
        "service_score": 4.69295
    }
}
```


### 19. 获取评价分类

    type: GET

    url: /shopping/rate/getTags/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 店铺id |

```javascript
{
    "status": 1,
    "data": [
        {
            "count": 20,
            "unsatisfied": true,
            "_id": "5c18e9251387630e5466df3f",
            "name": "不满意"
        }
    ]
}
```


### 20. 加入购物车(创建结算信息)

    type: POST

    url: /order/account/create

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| restaurant_id | Y | Number | 商铺id |
| deliver_fee | Y | Number | 配送费 |
| keyword | Y | Number | 关键词 |
| extra | N | Object | 打包信息 |
| manifest | Y | Array | 结算清单 |

> tip
(1) extra格式
"extra": {
	"name": "餐盒费",
	"price": 7,
	"quantity": 99
}
(2) manifest格式
"manifest": [{
	"food_id": 68,
	"item_id": 562,
	"name": "商铺111-分类1-凉皮1",
	"price": 999,
	"quantity": 2,
	"packing_fee": 7,
	"label": "特大" // 选填，其他必填
}]

```javascript
{
    "status": 1,
    "data": "结算信息创建成功"
}
```


### 21. 获取备注信息

    type: GET

    url: /shopping/remark/all

```javascript
{
    "status": 1,
    "data": [
        [
            {
                "id": 1,
                "label": "不要辣"
            },
            {
                "id": 2,
                "label": "少点辣"
            }
        ],
        [
            {
                "id": 3,
                "label": "多点辣"
            }
        ]
    ]
}
```


### 30. 下单

    type: POST

    url: /order/indent/create

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| account_id | Y | Number | 结算信息id |
| address_id | Y | Number | 地址id |
| restaurant_id | Y | Number | 商铺id |
| hongbao | N | Number | 红包额 |
| pay_type | N | Number | 支付方式 |
| remarks | N | Array | 备注 |
| self_remarks | N | String | 自定义备注 |
| need_invoice | N | Boolean | 发票 |
| invoice | N | String | 发票抬头 |

> tip：remarks格式
remarks: [1, 2, 3]

```javascript
{
    "status": 1,
    "message": "订单创建成功"
}
```


### 31. 获取订单列表

    type: GET

    url: /order/indent/list

```javascript
{
    "status": 1,
    "data": [
        {
            "extra": {
                "name": "餐盒费",
                "price": 7,
                "quantity": 99
            },
            "hongbao": 99,
            "pay_type": 1,
            "remarks": [
                1,
                2,
                3
            ],
            "invoice": "天津西瑞尔",
            "id": 6,
            "user_id": 1,
            "account_id": 5,
            "address_id": 1,
            "restaurant_id": 34,
            "self_remarks": "多放醋",
            "need_invoice": true,
            "create_time": 1545228138176,
            "due_time": 1545229038176,
            "restaurant_name": "商铺111",
            "restaurant_image_url": "http://pjchsh1l8.bkt.clouddn.com/1679d83003420.jpeg",
            "total_price": 4425,
            "deliver_fee": 25,
            "manifest": [
                {
                    "packing_fee": 7,
                    "_id": "5c1a35ff63487f0a54a667b4",
                    "food_id": 68,
                    "item_id": 562,
                    "name": "商铺111-分类1-凉皮1",
                    "price": 999,
                    "quantity": 2,
                    "label": "特大"
                },
                {
                    "packing_fee": 7,
                    "_id": "5c1a35ff63487f0a54a667b3",
                    "food_id": 68,
                    "item_id": 563,
                    "name": "商铺111-分类1-凉皮1",
                    "price": 897,
                    "quantity": 2,
                    "label": "大"
                }
            ],
            "status": -1,
            "statusTitle": "支付超时"
        }
    ]
}
```


### 32. 订单详情

    type: GET

    url: /order/indent/detail/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 订单id |

```javascript
{
    "status": 1,
    "data": {
        "extra": {
            "name": "餐盒费",
            "price": 7,
            "quantity": 99
        },
        "hongbao": 99,
        "pay_type": 1,
        "remarks": [
            1,
            2,
            3
        ],
        "invoice": "天津西瑞尔",
        "id": 5,
        "user_id": 1,
        "account_id": 5,
        "address_id": 1,
        "restaurant_id": 34,
        "self_remarks": "多放醋",
        "need_invoice": true,
        "create_time": 1545227750026,
        "due_time": 1545228650026,
        "restaurant_name": "商铺111",
        "restaurant_image_url": "http://pjchsh1l8.bkt.clouddn.com/1679d83003420.jpeg",
        "total_price": 4425,
        "deliver_fee": 25,
        "manifest": [
            {
                "packing_fee": 7,
                "_id": "5c1a35ff63487f0a54a667b4",
                "food_id": 68,
                "item_id": 562,
                "name": "商铺111-分类1-凉皮1",
                "price": 999,
                "quantity": 2,
                "label": "特大"
            }
        ]
    }
}
```


### 50. 更新商铺

    type: POST

    url: /shopping/shop/updateShop

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 商铺id |
| name | Y | String | 名称 |
| address | Y | String | 地址 |
| phone | Y | Number | 联系电话 |
| latitude | N | Number | 纬度 |
| longitude | N | Number | 经度 |
| category_id | Y | Number | 种类id |
| image_path | Y | String | 商铺图片链接 |

```javascript
{
    "status": 1,
    "data": "商铺信息修改成功"
}
```


### 51. 删除商铺

    type: DELETE

    url: /shopping/shop/deleteShop/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 商铺id |

```javascript
{
    "status": 1,
    "data": "商铺删除成功"
}
```


### 55. 更新商品

    type: POST

    url: /shopping/food/updateFood

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 商品id |
| name | Y | String | 名称 |
| image_path | Y | String | 图片链接 |
| new_menu_id | Y | Number | 分类id |

```javascript
{
    "status": 1,
    "data": "商品信息修改成功"
}
```


### 56. 删除商品

    type: DELETE

    url: /shopping/food/deleteFood/:id

| 参数 | 必选 | 类型 | 说明 |
| -- | -- | -- | -- |
| id | Y | Number | 商品id |

```javascript
{
    "status": 1,
    "data": "商品删除成功"
}
```



