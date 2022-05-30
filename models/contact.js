const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    contact_details:[],
  /*   service: {
      type: String,
      required: true
    } */
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("contactDetails", contactSchema);
