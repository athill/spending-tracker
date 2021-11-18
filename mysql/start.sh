#!/bin/bash

docker run -d --name spending-db -v $SPENDING_DB_LOCATION:/var/lib/mysql -e "MYSQL_ROOT_PASSWORD=$SPENDING_DB_PASSWORD" --publish 6603:3306 spending-db