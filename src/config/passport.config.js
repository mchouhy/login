// Importación de los módulos de Passport:
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// Importación de UserModel:
import UserModel from "../models/user.model.js";
// Importación de las funciones de bcrypt:
import { createHash, isValidPassword } from "../utils/hashbcrypt";

const initializePassport = () => {
  // Creación de la estrategia de passport para el registro de usuarios:
  passport.use(
    "register",
    new LocalStrategy(
      {
        // Accedemos al objeto request:
        passReqToCallback: true,
        // Campo para el usuario será el email:
        usernameField: "email",
        // Done es el next de los middlewares:
      },
      async (request, username, password, done) => {
        const { first_name, last_name, email, age } = request.body;
        try {
          // Validación si existe el usuario:
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          // Validación en caso de que no exista el usuario:
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          // Guardamos el usuario en la BD:
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Creación de la estrategia de passport para el login de usuarios:
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("El usuario no existe.");
            return done(null, false);
          }

          if (!isValidPassword(password, user)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización y desialización de usuarios:
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });
};

export default initializePassport;
