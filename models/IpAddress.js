const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var isToday = require("date-fns/is_today");

const ipAddressSchema = new Schema(
  {
    ipAddress: {
      type: String,
      unique: true,
      trim: true,
      required: ""
    },
    logins: {
      type: [Date],
      required: "",
      trim: true
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

ipAddressSchema.virtual("loginsToday").get(function() {
  return this.logins.reduce((total, date) => {
    return isToday(date) ? total + 1 : total;
  }, 0);
});

module.exports = mongoose.model("IpAddress", ipAddressSchema);
