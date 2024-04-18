// Importación del Router de Express JS:
import { Router } from "express";
// Creación del Router de Sessions:
const sessionsApiRouter = Router();
// Importación de Passport:
import passport from "passport";

// Ruta POST de register con Passport Local:
sessionsApiRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/register-failed",
  }),
  async (request, response) => {
    if (!request.user)
      return response
        .status(400)
        .send("Error. Las credenciales son inválidas.");

    request.session.user = {
      first_name: request.user.first_name,
      last_name: request.user.last_name,
      age: request.user.age,
      email: request.user.email,
    };

    request.session.login = true;

    response.redirect("/session/profile");
  }
);

// Ruta GET de fallo de registro:
sessionsApiRouter.get("/register-failed", (request, response) => {
  response.send("Error. Fallo al registrar el usuario. Intente nuevamente.");
});

// Ruta POST de login con Passport local:
sessionsApiRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/login-failed",
  }),
  async (request, response) => {
    if (!request.user)
      return response
        .status(400)
        .send("Error. Las credenciales son inválidas.");

    request.session.user = {
      first_name: request.user.first_name,
      last_name: request.user.last_name,
      age: request.user.age,
      email: request.user.email,
    };

    request.session.login = true;

    response.redirect("/session/profile");
  }
);

// Ruta GET de fallo de login:
sessionsApiRouter.get("login-failed", (request, response) => {
  response.send("Error. Fallo al iniciar sesión. Intente nuevamente.");
});

// Ruta GET de logout de la sesión:
sessionsApiRouter.get("/logout", (request, response) => {
  if (request.session.login) {
    request.session.destroy();
  }
  response.redirect("/session/login");
});

// Exportación del router del api de Sessions:
export default sessionsApiRouter;
