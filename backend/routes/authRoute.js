const router = require("express").Router();
const { login } = require("../controllers/loginController");
const { signup } = require("../controllers/signupController");


router.post("/login", login);
router.post("/signup", signup);

module.exports = router;