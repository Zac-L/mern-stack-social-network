const http = require('http');
const connect = require('./connect');
const app = require('./routes/app');

connect();

http.createServer(app);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port: ${port}`)); //eslint-disable-line