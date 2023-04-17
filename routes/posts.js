const router = require("express").Router();
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkauth");
const { privatePosts } = require("../db");

router.get("/getPrivatePosts", (req, res) => {
    console.log(req.headers)
  const isAuthPresent = req.header('x-auth-token');
  if (!isAuthPresent) {
    return res.status(400).json({
      errors: [
        {
          msg: "Please provide token",
        },
      ],
    });
  }

  const isValidToken = jwt.verify(isAuthPresent, 'gdasgdsagyefyegfjajfahfhgafgd');
  
  if (isValidToken) {
    return res.status(200).json(privatePosts);
  }
  console.log("isAuthPresent....", isAuthPresent);
});

module.exports = router;
