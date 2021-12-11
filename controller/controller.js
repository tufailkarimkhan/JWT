const register = require("../model/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const secretKey = "ajkdjkhfi";

// for Authentication
exports.validateToken = async (req, res, next) => {
  console.log(req.body.cookie);
  try {
    const access_token = req.cookies.accessToken; //here i store cookie name inside the req.cookie
    // const access_token = req.cookie["cookieJWT"];
    // console.log(req.cookie + "line 12");
    console.log(access_token);
    if (!access_token) {
      res.redirect("/login");
    }
    const validToken = jwt.verify(access_token, secretKey);
    console.log(validToken, "Line no 16");
    if (validToken) {
      console.log(validToken);
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.json({
      status: 409,
      error: `Sorry You are not authorized ${err}`,
    });
  }
};
// for Register get route
exports.registerget = (req, res) => {
  res.render("register", { message: req.flash("info") });
};
// for Register
exports.registerRoute = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("here data come from form ", req.body);
    let user = await register.findOne({ email: email });

    if (user) {
      req.flash("info", " Email Already Exists");
      res.redirect("/register");
    }
    let encryptPass = await bcrypt.hash(password, 10);
    console.log("here encrypt data: ", encryptPass);
    user = await new register({
      firstName,
      lastName,
      email,
      password: encryptPass,
    });
    user.save();
    res.redirect("/login");
  } catch (err) {
    console.log("Error from register Logic " + err);
  }
};
// for login get
exports.loginget = (req, res) => {
  res.render("login", { message: req.flash("Warning") });
};
// for login post
exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    let userLogin = await register.findOne({ email: email });
    console.log(userLogin);
    if (!userLogin) {
      req.flash("Warning", "Sorry Email not exists try again");
    }
    let comparePass = await bcrypt.compare(password, userLogin.password);
    if (!comparePass) {
      req.flash("Warning", "Sorry Wrong Password");
    }

    let jwtToken = jwt.sign({ email: email, password: password }, secretKey);
    res.cookie("accessToken", jwtToken, { maxAge: 60 * 60 * 24 }); // "accessToken" is the name of cookie
    // res.json({
    //   status: 200,
    //   message: `Welcome ${userLogin.firstName} our Admin Panel`,
    //   token: jwtToken,
    // });
    res.redirect("/update");
  } catch (err) {
    console.log(err);
  }
};

// for user Data update
exports.UserUpdateget = (req, res) => {
  res.render("updateUser", { message: req.flash("info") });
};
exports.userUpdate = async (req, res) => {
  const { email, firstName, lastName } = req.body;
  console.log(req.body);
  let userName = await register.findOne({ email: email });
  let updateInfo = await register.findOneAndUpdate(
    { email: email },
    { firstName: firstName, lastName: lastName },
    { new: true }
  );
  console.log(updateInfo);
  if (!updateInfo) {
    req.flash("info", " Opps Somthing wrong!");
    res.redirect("/update");
  }

  req.flash(
    "info",
    "user Name " + userName.firstName + " update with " + updateInfo.firstName
  );
};

// user => login -> systme => jwtid(cookie) => browser smain save hogaya cookeis
// homepage + cookies => update => previously => vlidation => update controller
