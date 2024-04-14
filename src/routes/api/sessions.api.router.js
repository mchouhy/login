// Importación del Router de Express JS:
import { Router } from "express";
// Creación del Router de Sessions:
const sessionsApiRouter = Router();
// Importación del model de user:
import UserModel from "../../models/user.model.js";
// Importación de la función de hasheo de contraseñas:
import { createHash, isValidPassword } from "../../utils/hashbcrypt.js";

// Ruta POST de register:
sessionsApiRouter.post("/", async (request, response) => {
  const { first_name, last_name, age, email, password } = request.body;
  try {
    // Verificación si el correo está en la base de datos:
    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
      return response
        .status(400)
        .send(
          "Error. El correo electrónico ingresado ya se encuentra registrado."
        );
    }
    // Creación del rol de admin:
    const role =
      email === "adminCoder@coder.com" && password === "adminCod3r123"
        ? "administrador"
        : "usuario";
    // Creación del nuevo ususario:
    const newUser = await UserModel.create({
      first_name,
      last_name,
      age,
      email,
      password: createHash(password),
      role,
    });
    // Creación de la session:
    request.session.login = true;
    request.session.user = {
      ...newUser._doc,
    };
    response.redirect("/session/profile");
  } catch (error) {
    response
      .status(500)
      .send("Error al intentar recuperar los datos de registro.");
  }
});

// Ruta POST de login:
sessionsApiRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      if (isValidPassword(password, user)) {
        request.session.login = true;
        request.session.user = {
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
          role: user.role,
        };
        response.redirect("/products");
      } else {
        response.status(401).send("Contraseña inválida.");
      }
    } else {
      response.status(404).send("Usuario no encontrado.");
    }
  } catch (error) {
    response.status(500).send("Error. Usuario o contraseña incorrecta.");
  }
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
