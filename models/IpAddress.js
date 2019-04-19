const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ipAddressSchema = new Schema({
  ipAddress: {
    type: String,
    unique: true,
    trim: true,
    required: ''
  },
  logins: {
    type: [Date],
    required: '',
    trim: true
  }
});


module.exports = mongoose.model('IpAddress', ipAddressSchema);
