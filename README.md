# spending

## database
```
docker build -t spending-db .

export SPENDING_DB_LOCATION=<db-location>

docker run -d --name spending-db -v $SPENDING_DB_LOCATION:/var/lib/mysql --publish 6603:3306 spending-db
```

https://daveceddia.com/create-react-app-express-backend/

