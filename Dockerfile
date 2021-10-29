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

## 必要そうなコマンドのインストール ##
# 現状dockerでsystemctlは使えない状態
# 原因はPID1が /sbin/init でないから
#RUN apt install -y systemctl
# systemctlを使うなら、journalctlも使いたい
# でも、なぜかコンテナ内でinstallできない
# apt-cache search journalctl で探してみてもでてこない
#RUN apt install -y journalctl

## MongoDBのストレージとなるディレクトリを作成 ##
WORKDIR /data/db