FROM ubuntu:20.04

# apt install

RUN apt update
RUN apt install python3 -y
# python 3.8.10
RUN apt install python3-pip -y
# pip 20.0.2
RUN pip3 install pymongo
# pymongo-4.0.1