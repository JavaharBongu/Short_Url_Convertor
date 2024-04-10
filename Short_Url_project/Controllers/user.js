// const { v4: uuidv4 } = require("uuid");
const User = require("../Models/user");
const {setUser} = require("../service/auth.js");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password",
    });

  // const sessionId = uuidv4();
  // setUser(sessionId, user);
  // res.cookie("uid", sessionId);
  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
  // return res.json({token});
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};