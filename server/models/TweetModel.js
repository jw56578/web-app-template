const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String
  },

  text: {
    type: String
  }
});

module.exports = mongoose.model("Tweet", userSchema);