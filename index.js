const mongoose = require('mongoose');

// environment variables
require('dotenv').config({ path: 'variables.env' });

// Connect to db
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`mongoose error ${err.message}`);
});

// import model
require('./models/User');

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
