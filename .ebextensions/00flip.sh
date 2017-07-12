#!/bin/bash
# Author SamarAcharya <samar@techgaun.com>
# replaces default EB docker config generator

set -e

. /opt/elasticbeanstalk/hooks/common.sh

EB_CONFIG_DOCKER_STAGING_PORT_FILE=$(/opt/elasticbeanstalk/bin/get-config  container -k staging_port_file)
EB_CONFIG_DOCKER_CURRENT_PORT_FILE=$(/opt/elasticbeanstalk/bin/get-config  container -k deploy_port_file)

EB_CONFIG_DOCKER_STAGING_APP_FILE=$(/opt/elasticbeanstalk/bin/get-config  container -k app_staging_file)
EB_CONFIG_DOCKER_CURRENT_APP_FILE=$(/opt/elasticbeanstalk/bin/get-config  container -k app_deploy_file)

EB_CONFIG_DOCKER_IMAGE_STAGING=$(/opt/elasticbeanstalk/bin/get-config  container -k staging_image)
EB_CONFIG_DOCKER_IMAGE_CURRENT=$(/opt/elasticbeanstalk/bin/get-config  container -k deploy_image)

EB_CONFIG_HTTP_PORT=$(/opt/elasticbeanstalk/bin/get-config  container -k instance_port)

# now the STAGING container is built and running, flip nginx to the new container
EB_CONFIG_NGINX_UPSTREAM_PORT=`cat $EB_CONFIG_DOCKER_STAGING_PORT_FILE`

#start datadog container
DATADOG_API=$(/opt/elasticbeanstalk/containerfiles/support/generate_env | grep ^DATADOG_API | cut -d "=" -f2)

CGROUP_DIR=""
if [ -d "/cgroup" ]; then
    CGROUP_DIR="/cgroup"
elif [ -d "/sys/fs/cgroup/" ]; then
    CGROUP_DIR="/sys/fs/cgroup/"
fi

if [ "x${CGROUP_DIR-}" != "x" -a "x${DATADOG_API-}" != "x" ]; then
    if ps aux | grep "[d]d-agent" > /dev/null
    then
        echo "Docker container for data dog running already"
    else
        docker run -d --privileged --name dd-agent -h `hostname` -v /var/run/docker.sock:/var/run/docker.sock -v /proc/mounts:/host/proc/mounts:ro -v ${CGROUP_DIR}:/host/sys/fs/cgroup:ro -e API_KEY=$DATADOG_API datadog/docker-dd-agent
    fi
fi

# get number of CPU
NUM_OF_CPU=$(getconf _NPROCESSORS_ONLN)
PORT_START=$(/opt/elasticbeanstalk/containerfiles/support/generate_env | grep ^PORT | cut -d "=" -f2 || echo 3000)
PORT_END=$(($PORT_START+$NUM_OF_CPU))
SRV_BLOCKS=""

# get docker container IP
DOCKER_IP=$(docker ps -a | grep "Up" | grep -v "docker-dd-agent" | cut -d" " -f1 | xargs --no-run-if-empty docker inspect -f "{{.NetworkSettings.IPAddress}}" | head -n1)

# create server blocks
#for ((i = $PORT_START; i < $PORT_END; i++)); do
#    IFS=" " SRV_BLOCKS+="server $DOCKER_IP:$i max_fails=3 fail_timeout=5s;"
#done

# fallback to default if SRV_BLOCKS empty

if [ "x$SRV_BLOCKS" == "x" ]; then
    SRV_BLOCKS="server 127.0.0.1:$EB_CONFIG_NGINX_UPSTREAM_PORT;"
fi
# set up nginx
cat > /etc/nginx/sites-available/elasticbeanstalk-nginx-docker.conf <<EOF
server_tokens off;
sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 15;
types_hash_max_size 2048;
open_file_cache max=200000 inactive=5s;
open_file_cache_valid 15s;
open_file_cache_min_uses 1;
open_file_cache_errors off;
client_max_body_size 10M;
large_client_header_buffers 8 5120k;
gzip on;
gzip_min_length 10240;
gzip_comp_level 3;
gzip_disable "MSIE [1-6] \.";
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;
upstream docker {
        ip_hash;
	$SRV_BLOCKS
	keepalive 256;
}

server {
  listen $EB_CONFIG_HTTP_PORT default proxy_protocol;

  location ~* ^.+\.html.* {
    add_header Access-Control-Allow-Origin *;
    proxy_pass  http://docker;
    proxy_set_header   Connection "";
    proxy_http_version 1.1;
    proxy_set_header        Host            \$host;
    proxy_set_header        X-Real-IP       \$remote_addr;
    proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for;
  }

  location ~* ^.+\.(css|js|ogg|ogv|svg|svgz|eot|otf|woff|mp4|ttf|rss|atom|jpg|jpeg|gif|png|ico|zip|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf).* {
    access_log off; log_not_found off; expires max;
    add_header Access-Control-Allow-Origin *;
    add_header Pragma public;
    add_header Cache-Control "max-age=315360, public";
    proxy_pass  http://docker;
    proxy_set_header   Connection "";
    proxy_http_version 1.1;
    proxy_set_header        Host            \$host;
    proxy_set_header        X-Real-IP       \$remote_addr;
    proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://docker;
    proxy_http_version 1.1;

    proxy_set_header  Connection    "";
    proxy_set_header  Host          \$host;
    proxy_set_header  X-Real-IP     \$remote_addr;
    proxy_set_header  X-Forwarded-For   \$proxy_add_x_forwarded_for;
  }

  location /socket.io/ {
    proxy_pass http://docker;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}

server {
    server_name developers.brightergy.com support.brightergy.com;
    root /var/app/current/docs;
}
EOF
ln -sf /etc/nginx/sites-available/elasticbeanstalk-nginx-docker.conf /etc/nginx/sites-enabled/
service nginx restart || error_exit "Failed to start nginx, abort deployment" 1

mv $EB_CONFIG_DOCKER_STAGING_PORT_FILE $EB_CONFIG_DOCKER_CURRENT_PORT_FILE

# stop and delete "current"
if [ -f $EB_CONFIG_DOCKER_CURRENT_APP_FILE ]; then
	EB_CONFIG_DOCKER_CURRENT_APP=`cat $EB_CONFIG_DOCKER_CURRENT_APP_FILE | cut -c 1-12`
	echo "Stopping current app container: $EB_CONFIG_DOCKER_CURRENT_APP..."

	if docker ps | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		stop_upstart_service eb-docker
	fi

	if docker ps | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		docker kill $EB_CONFIG_DOCKER_CURRENT_APP
	fi

	if docker ps -a | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		docker rm $EB_CONFIG_DOCKER_CURRENT_APP
	fi

	EB_CONFIG_DOCKER_IMAGE_ID_STAGING=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_STAGING | awk '{ print $3 }'`
	EB_CONFIG_DOCKER_IMAGE_ID_CURRENT=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_CURRENT | awk '{ print $3 }'`

	# this check is necessary since due to caching/config deploy these two could be the same image
	if [ "$EB_CONFIG_DOCKER_IMAGE_ID_STAGING" != "$EB_CONFIG_DOCKER_IMAGE_ID_CURRENT" ]; then
		docker rmi $EB_CONFIG_DOCKER_IMAGE_CURRENT || true
	fi
fi

# flip "STAGING" to "current"
echo "Making STAGING app container current..."
EB_CONFIG_DOCKER_IMAGE_ID_STAGING=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_STAGING | awk '{ print $3 }'`
docker tag $EB_CONFIG_DOCKER_IMAGE_ID_STAGING $EB_CONFIG_DOCKER_IMAGE_CURRENT
docker rmi $EB_CONFIG_DOCKER_IMAGE_STAGING

mv $EB_CONFIG_DOCKER_STAGING_APP_FILE $EB_CONFIG_DOCKER_CURRENT_APP_FILE

# start monitoring it
start_upstart_service eb-docker

trace "Docker container `cat $EB_CONFIG_DOCKER_CURRENT_APP_FILE | cut -c 1-12` is running $EB_CONFIG_DOCKER_IMAGE_CURRENT."
