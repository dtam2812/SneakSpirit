const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const getListUser = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {}
};

const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    return res.status(200).send(user);
  } catch (error) {}
};

const postUser = async (req, res) => {
  try {
    const { userName, telephone, email, password, role } = req.body;
    await userModel.create({
      userName: userName,
      telephone: telephone,
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: role,
    });
    return res.status(200).send("create user successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    await userModel.findByIdAndDelete(userId);
    return res.status(200).send("delete user successfully");
  } catch (error) {}
};

const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getListUser: getListUser,
  getUserDetail: getUserDetail,
  postUser: postUser,
  deleteUser: deleteUser,
  updateUserPassword: updateUserPassword,
};
