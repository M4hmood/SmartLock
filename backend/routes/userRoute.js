const router = require("express").Router();
const userController = require("../controllers/userController");


// User Crud routes

// http://localhost:3001/Users
router.route("/")
    .get(userController.getUsers)
    .post(userController.createUser);

// http://localhost:3001/Users/:id
router.route("/:id")
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;