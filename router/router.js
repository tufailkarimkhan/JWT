const express = require("express");
const route = express.Router();

// here we require registerRoute from controller page
const {
  registerget,
  registerRoute,
  loginget,
  login,
  UserUpdateget,
  userUpdate,
  validateToken,
} = require("../controller/controller");
// here we set post method and set end point of Register.
route.get("/register", registerget);
route.post("/register", registerRoute);
// here we set post method and set end Point of Login
route.get("/login", loginget);
route.post("/login", login);
// here we set post method and set end Point of update userInfo
route.get("/update", validateToken, UserUpdateget);
route.post("/update", userUpdate);

module.exports = route;
