# Postgres

## PostgresSQL Install

```sh
brew install postgresql
```

## Start/Stop PostgreSQL

### Start

```sh
brew services start postgresql
```

### Stop

```sh
brew services stop postgresql
```

## PostgresSQL Login

```sh
psql postgres
```

## Setup Sample

- create database

```sql
postgres=# create database <db name>;
```

- create user

```sql
postgres=# create user <username> with password '<password>';
```

- utf8

```sql
postgres=# alter role <username> set client_encoding to 'utf8';
```

- transaction isolate level

```sql
postgres=# alter role <username> set default_transaction_isolation to 'read committed';
```

- timezone

```sql
postgres=# alter role <username> set timezone to 'UTC';
```

- DB access

```sql
postgres=# grant all PRIVILEGES on database <db name> to <username>;
```


## Command

### User

- User List

```sql
postgres=# \du
```


### Database

- Database List

```sql
postgres=# \l
```

## Reference

- [MySQLとPostgreSQLコマンド比較表](https://qiita.com/aosho235/items/c657e2fcd15fa0647471)
