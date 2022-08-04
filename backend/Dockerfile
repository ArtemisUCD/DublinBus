FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN apt-get update && apt-get install -y build-essential
RUN apt-get -y install default-libmysqlclient-dev
RUN pip3 install -r requirements.txt
COPY . .