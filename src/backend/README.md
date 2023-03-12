# 環境構築

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
DATABASE_URL= # postgres://<username>:<password>@localhost/<db name>
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
