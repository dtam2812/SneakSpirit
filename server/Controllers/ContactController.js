const contactModel = require("../Models/ContactModel");

const getListContact = async (req, res) => {
  try {
    const contacts = await contactModel.find();
    return res.status(200).send(contacts);
  } catch (error) {}
};

const postContact = async (req, res) => {
  try {
    const { name, email, telephone, contactContent } = req.body;
    await contactModel.create({
      name: name,
      email: email,
      telephone: telephone,
      contactContent: contactContent,
    });
    return res.status(200).send("create contact successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    await contactModel.findByIdAndDelete(contactId);
    return res.status(200).send("delete contact successfully");
  } catch (error) {}
};

module.exports = {
  postContact: postContact,
  getListContact: getListContact,
  deleteContact: deleteContact,
};
