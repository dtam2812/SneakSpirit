const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  email: String,
  name: String,
  telephone: Number,
  contactContent: String,
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
