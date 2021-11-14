# spending

## database
```
# set data location
export SPENDING_DB_LOCATION=<db-location>

# build - builds an image called spending-db
./mysql/build.sh

# run - will create a container called spending-db running at localhost:6603
./mysql/start.sh

# stop
./mysql/stop.sh
```


