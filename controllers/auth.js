var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;

const dotenv = require("dotenv");
dotenv.config();

/* Signup controller  */
const signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({
      message: "User register successfully",
      token,
      email: req.body.email,
      username: req.body.username,
    });
    return;
  } catch (error) {
    console.log("Error registering the user");
    res.status(500).json({ message: "Error on registering user" });
  }
};

/* Signin controller */
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid password",
        token: null,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.json({
      message: "Login successful",
      email,
      token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signout = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  res.clearCookie(accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.json({ message: "Logged out successfully" });

  next();
};

module.exports = {
  signup: signup,
  signin: signin,
  signout: signout,
};
