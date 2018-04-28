## A Node.js service built as a test task for http://iotblue.net/

### You can run locally on your machine by following these steps:
> You need to have **Node.js** and **MongoDB** installed.

Clone this repository
``` shell
git clone https://github.com/ishendyweb/nodejs-test test-task
cd test-task
```

Install dependencies
``` shell
npm install
```

Add sample products
``` shell
node seed/product-seeder.js
```

Start NodeJS server at http://localhost:3000 (./bin/www)
``` shell
npm start
```

---

To change database configurations:
- Two files:

1. app.js:
``` javascript
mongoose.connect('mongodb://localhost:27017/shopping', {
	useMongoClient: true,
	/* other options */
});
```

2. seed/product-seeder.js:
``` javascript
mongoose.connect('mongodb://localhost:27017/shopping', {
	useMongoClient: true,
	/* other options */
});
```

