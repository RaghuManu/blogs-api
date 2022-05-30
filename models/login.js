const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema(
  {
    loginId: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model("loginDetails", loginSchema);
