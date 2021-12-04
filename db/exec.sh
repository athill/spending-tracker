#!/bin/bash

docker exec -it spending-db sh -c "mysql -u root -p${SPENDING_DB_PASSWORD} spending"
