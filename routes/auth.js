const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post(
  "/signup",
  [
    body("email", "please provide a valid email").isEmail(),
    body("password", "password length greater than 5 chars").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    //check if email, password are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check if email exists already
    const isValidUser = users.find((user) => {
      console.log(user);
      return user.email === email;
    });
    console.log("isValidUser..", isValidUser);
    if (isValidUser) {
      return res.status(400).json({
        errors: [
          {
            msg: "Email Taken",
          },
        ],
      });
    }

    //hash and store the password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hashPassword...", hashPassword);
    users.push({ email: email, password: hashPassword });

    //generate jwt
    const token = jwt.sign({ email }, "gdasgdsagyefyegfjajfahfhgafgd", {
      expiresIn: 360000,
    });

    res.status(200).json({ token });
  }
);

router.get("/all", (req, res) => {
  res.status(200).json(users);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //check if user exists.
  const isUserExist = users.find((user) => {
    return user.email === email;
  });
  if (!isUserExist) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials.",
        },
      ],
    });
  }

  //compare if provided password matches with hashpassword
  const isMatch = await bcrypt.hash(password, 10);
  if (isMatch) {
    const token = jwt.sign({ email }, "gdasgdsagyefyegfjajfahfhgafgd", {
      expiresIn: 360000,
    });
    res.status(200).json({ token });
  }
  

});

module.exports = router;
