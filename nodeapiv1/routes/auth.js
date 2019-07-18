const express = require("express");
const {
    signup,
    signin,
    signout,
    signinWithout
} = require("../controllers/auth");

// import password reset validator
const { userSignupValidator } = require("../validator");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.post("/signinWithout", signinWithout);
router.get("/signout", signout);



// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;