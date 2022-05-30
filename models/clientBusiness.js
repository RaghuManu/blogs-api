const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientBusinessSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
      required: true
    },
    job: {
      type: String,
      required: true
    },
    business_info: [],
    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("businessInfo", clientBusinessSchema);
