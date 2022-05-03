FROM python:3.10
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG 0
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN adduser --disabled-password myuser
USER myuser
CMD gunicorn CourseWork.wsgi:application --bind 0.0.0.0:$PORT
