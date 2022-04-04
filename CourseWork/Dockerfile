FROM python:3.10
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
COPY requirements.txt /backend/
RUN pip3 install -r requirements.txt && pip3 install dnspython
ADD . /backend/