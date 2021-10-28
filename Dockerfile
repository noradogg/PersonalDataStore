FROM ubuntu:20.04

### 必要パッケージのインストール ###
RUN apt update

## MongoDBのインストール ##
RUN apt install -y wget
RUN apt install -y gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc \
     | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" \
     > /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt update
RUN apt install -y mongodb-org
# Geographic area: 6, Time zone: 79, Current default time zone: 'Asia/Tokyo'

## MongoDBのストレージとなるディレクトリを作成 ##
WORKDIR /data/db