FROM debian
RUN apt-get -y update &&\
    apt-get install -y apache2 &&\
    rm -rf /var/lib/apt/lists/*
ENTRYPOINT apachectl -D FOREGROUND