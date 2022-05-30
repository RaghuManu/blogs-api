const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscribeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    subscribe_technology: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("subscribeDetails", subscribeSchema);
