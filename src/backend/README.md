# 環境構築

## 本番環境

### 管理画面

- https://cardene7.pythonanywhere.com/admin
- username
  - admin
- password
  - admin


### API

- https://cardene7.pythonanywhere.com/api/

### test Curl

- curl -X GET https://cardene7.pythonanywhere.com/api/projects/

## Python & Poetry Setup

- 以下の記事を参考にしてください。

- https://bcl.sci.yamaguchi-u.ac.jp/~jun/notebook/python/install-poetry/


## Install Module

```sh
$ poetry install
```

## 仮想環境有効化

```sh
$ poetry shell
```

## Setup

### ENV

```sh
$ touch .env
```

```sh
DJANGO_SECRET_KEY=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306
```
