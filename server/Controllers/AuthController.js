const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    //get info from client
    const { userName, telephone, email, password } = req.body;

    //create data to database
    await userModel.create({
      userName: userName,
      telephone: telephone,
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: "regular",
    });
    return res.status(200).send("register user");
  } catch (error) {
    console.log("error", error);
  }
};

const login = async (req, res) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Tài khoản hoặc mật khẩu không đúng");
  }

  //check password
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send("Tài khoản hoặc mật khẩu không đúng");
  }

  const jwtToken = jwt.sign(
    {
      _id: user.id,
      userName: user.userName,
      role: user.role,
    },
    process.env.SECRET_JWT,
    {
      expiresIn: 3600,
    },
  );

  return res.status(200).send({
    accessToken: jwtToken,
  });
};

module.exports = {
  register: register,
  login: login,
};
