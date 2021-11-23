# spending-tracker

App to track spending


## Usage
### install
```
git clone https://github.com/athill/spending-tracker.git
cd spending-tracker
npm run installer
```

### database
```
# set data location and password
export SPENDING_DB_LOCATION=<db-location>
export SPENDING_DB_PASSWORD=<password>

# build - builds an image called spending-db
npm run mysql:build

# run - will create a container called spending-db running at localhost:6603
npm run mysql:start

# create tables and views
npm run mysql:setup

# stop the database
npm run mysql:stop
```

### development
This starts the backend server and the ui. Database must be started separately.
```
npm run dev # or npm run start
```

### server
```
# start server
npm run server
```

### ui
```
# start ui
npm run web
```


