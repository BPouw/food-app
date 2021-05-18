const routes = require("express").Router();
const AuthController = require("../controllers/user-controller");

routes.post("/login", AuthController.validateLogin, AuthController.login);
routes.post(
  "/register",
  AuthController.validateRegister,
  AuthController.register
);
routes.get(
  "/validate",
  AuthController.validateToken,
  AuthController.renewToken
);

module.exports = routes;
