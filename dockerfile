# Cheat Sheet - https://github.com/wsargent/docker-cheat-sheet

FROM debian:stable-slim

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qqy   && apt-get -qqy install        dumb-init curl git-all gnupg wget zip ca-certificates        python-pip apt-transport-https ttf-wqy-zenhei xvfb   && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -   && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list   && apt-get update -qqy   && apt-get -qqy install google-chrome-unstable   && rm /etc/apt/sources.list.d/google-chrome.list   && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN groupadd -g 10101 bamboo   && useradd bamboo --shell /bin/bash --create-home -u 10101 -g 10101   && usermod -a -G sudo bamboo   && echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers   && echo 'bamboo:nopassword' | chpasswd

RUN mkdir /data && chown -R bamboo:bamboo /data

RUN pip install awscli --upgrade

USER bamboo

ENTRYPOINT ["/usr/bin/dumb-init", "--",             "/usr/bin/google-chrome-unstable",             "--disable-gpu",             "--headless",             "--disable-dev-shm-usage",             "--remote-debugging-address=0.0.0.0",             "--remote-debugging-port=9222",             "--user-data-dir=/data"]
