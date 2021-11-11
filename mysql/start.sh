#!/bin/bash

docker run -d --name spending-db -v $SPENDING_DB_LOCATION:/var/lib/mysql --publish 6603:3306 spending-db