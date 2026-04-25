#!/bin/bash

date=$(date +%Y%m%d)

docker exec -it spending-db mysqldump --no-create-info --no-create-db -u root -p$SPENDING_DB_PASSWORD spending > ~/Downloads/${date}-spending.sql



cat ~/Downloads/${date}-spending.sql | docker exec -i spending-db mysql -u root -p$SPENDING_DB_PASSWORD spending