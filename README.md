# <<<<<<< HEAD

# chat_app

使用 vue 搭建一个聊天室

## Ⅰ Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Ⅱ Table

数据库表

### table 1 用户表

{

id    唯一序号

username 用户名

password 密码

email 邮箱

}

### table 2 消息表

{

id   唯一序号

from_user 发送人

to_user 接收人

text   文本内容

time   发送时间

---

type 类型 (系统消息 0,群组消息 1,个人消息 2)

showTime 是否显示时间

}

## Ⅲ WebSocketServer

type:system     服务端消息通知

type:user         客户端消息

#### 1.用户连接

连接成功后服务端会向所有客户端发送一条连接消息，显示当前在线总人数和人员列表
{
"type":"system",
"count":2,
"users":[{"username":"114514@qq.com"},{"username":"1919810@qq.com"}]
}

### 2.用户断联

断开连接和连接时的状况一样，都会发送相同格式的消息

### 3.发送消息

分为两种，一种是群组消息，另一种是个人消息

#### 个人消息

发送：

```json
{
  "to": "114514@qq.com",
  "text": "hello",
  "type": "single"
}
```

接收：

```json
{
  "showTime": true,
  "type": "single",
  "from": "114514@qq.com",
  "to": "1919810@qq.com",
  "time": "2024-11-05 10:39",
  "message": "hello"
}
```

#### 群组消息

发送：

```json
{
  "type": "group",
  "to": "group",
  "message": "hello"
}
```

接收：

```json
{
  "showTime": true,
  "type": "group",
  "from": "114514@qq.com",
  "to": "group",
  "time": "2024-11-05 10:39",
  "message": "hello"
}
```

## Ⅳ UserServer

http://172.18.4.118:8080/chat/user

### 1.注册功能

/register    post 请求

参数：json 类型

| 参数名称 | 类型   | 事项         |
| -------- | ------ | ------------ |
| email    | String | 进行正则验证 |
| username | String | 20 位以内    |
| password | String | 20 位以内    |

```json
{
  "username": "张三",
  "email": "114514@qq.com",
  "password": "1919810"
}
```

返回值：Object

| 参数名称 | 类型   | 事项               |
| -------- | ------ | ------------------ |
| code     | int    | 0 为失败，1 为成功 |
| msg      | String | 返回注册账号的结果 |
| data     | Object | 值为 null          |

```json
{
    "code": 0,
    "msg": "注册失败，用户已存在",
    "data": null
}

{
    "code": 1,
    "msg": "success",
    "data": "注册成功"
}
```

### 2.登录

/login    post 请求

参数：json 类型

| 参数名称 | 类型   | 事项 |
| -------- | ------ | ---- |
| email    | String |      |
| password | String |      |

```json
{
  "email": "114514@qq.com",
  "password": "1919810"
}
```

返回值：

| 参数名称 | 类型   | 事项               |
| -------- | ------ | ------------------ |
| code     | int    | 0 为失败，1 为成功 |
| msg      | String | 登录是否成功       |
| data     | Object |                    |

```json
{
    "code": 1,
    "msg": "success",
    "data": "登录成功"
}

{
    "code": 0,
    "msg": "登录失败,用户不存在或密码错误",
    "data": null
}
```

### 3.查询用户列表

/list    get 请求

| 参数名称 | 类型 | 事项 |
| -------- | ---- | ---- |
| 无       | 无   | 无   |

返回值：Object

| 参数名称 | 类型   | 事项 |
| -------- | ------ | ---- |
| code     | int    |      |
| msg      | String |      |
| data     | Array  | 列表 |

    {
        "code": 1,
        "msg": "success",
        "data": [
            {
                "id": 5,
                "username": "张三",
                "email": "1145141919810@qq.com",
                "password": null
            }
        ]
    }

### 4.更改名称

/rename    put 请求

参数：json 类型

| 参数名称 | 类型   | 事项 |
| -------- | ------ | ---- |
| email    | String |      |
| username | String |      |

```json
{
  "email": "114514@qq.com",
  "username": "绫地宁宁"
}
```

返回值：Object

| 参数名称 | 类型   | 事项 |
| -------- | ------ | ---- |
| code     | int    |      |
| msg      | String |      |
| data     | String |      |

```json
{
    "code": 1,
    "msg": "success",
    "data": "更改成功"
}

{
    "code": 0,
    "msg": "更改失败，用户不存在",
    "data": null
}
```

### 5.更改密码

/repsd    put 请求

参数：json 类型

| 参数名称 | 类型   | 事项 |
| -------- | ------ | ---- |
| email    | String |      |
| password | String |      |

```json
{
  "email": "114514@qq.com",
  "password": "1919810"
}
```

返回值：object

| 参数名称 | 参数类型 | 事项 |
| -------- | -------- | ---- |
| code     | int      |      |
| msg      | String   |      |
| data     | Object   |      |

```json
{
    "code": 1,
    "msg": "success",
    "data": "更改成功"
}

{
    "code": 0,
    "msg": "更改失败，用户不存在",
    "data": null
}
```

## Ⅴ fileUploader

思路：本地上传文件=>后端接收文件，显示上传条=>上传完毕后生成下载框=>在页面显示文件列表

在上传的同时返回文件表映射

进度条 websocket=>{

localStore:"",("uuid")

percent:"",

type:"upload/download"

}

文件表映射=>{

fileSize:""

fileName:""

uploadTime:""

type:"" (1:image,2:file)

uuid:"" (生成 uuid 存储)

from:""

to:""

}

增，删，查
