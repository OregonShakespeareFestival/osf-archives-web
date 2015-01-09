#####################################################
# OSF Ember DockerFile
#####################################################

#Declare Centos the latest
From centos

Maintainer Joel Ferrier

# Update
RUN yum update -y
#
RUN yum install -y epel-release
RUN \
  yum install -y \
  git \
  node-js \
  npm \
  nginx

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

ADD config/container/ember-server.conf /etc/nginx/conf.d/default.conf
ADD config/container/start-nginx.sh /usr/bin/start-nginx

ADD ./ /ember

WORKDIR /ember

RUN chmod +x /usr/bin/start-nginx

RUN npm install
RUN npm install -g bower
RUN bower install --allow-root
RUN npm install -g ember-cli
RUN ember build --environment staging

# Publish 80
EXPOSE 80

# Startup Commands
ENTRYPOINT /usr/bin/start-nginx
