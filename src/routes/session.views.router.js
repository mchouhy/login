// Importación de Express JS:
import { Router } from "express";
// Creación del Router de Express JS:
const sessionViewsRouter = Router();

// Ruta GET para renderizar la session:
sessionViewsRouter.get("/", (request, response) => {
  if (request.session.counter) {
    request.session.counter++;
    response.send(
      "El número de veces que has visitado este sitio es igual a " +
        request.session.counter
    );
  } else {
    request.session.counter = 1;
    response.send("Bienvenido al sitio por primera vez.");
  }
});

// Ruta GET para renderizar un logout:
sessionViewsRouter.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (!error) response.send("Sesión cerrada con éxito.");
    else response.send("Error al intentar cerrar la sesión.");
  });
});

// Ruta GET para renderizar la vista de register.handlebars:
sessionViewsRouter.get("/register", (request, response) => {
  response.render("register");
});

// Ruta GET para renderizar la vista de login.handlebars:
sessionViewsRouter.get("/login", (request, response) => {
  response.render("login");
});

// Ruta GET para renderizar la vista de profile.handlerbars:
sessionViewsRouter.get("/profile", (request, response) => {
  if (!request.session.login) {
    return response.redirect("/login");
  }
  response.render("profile", { user: request.session.user });
});

// Exportación del router para ser utilizado en la app:
export { sessionViewsRouter };
