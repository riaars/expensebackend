const express = require("express");
const authJWT = require("../middlewares/authJwt");
const controllers = require("../controllers/transaction");

const router = express.Router();

router.post("/", authJWT.verifyToken, controllers.deleteTransaction);

module.exports = router;
