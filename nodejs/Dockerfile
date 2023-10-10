FROM debian
RUN apt-get -y update &&\
    apt-get install -y npm &&\
    rm -rf /var/lib/apt/lists/*
RUN mkdir /scripts &&\
    cd /scripts &&\
    npm install websocket
ENTRYPOINT  cd /scripts && node src/index.mjs