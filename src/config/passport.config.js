// Importación de los módulos de Passport:
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// Importación de UserModel:
import UserModel from "../models/user.model.js";
// Importación de las funciones de bcrypt:
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
// Importación de la estrategia de github de passport:
import GitHubStrategy from "passport-github2";

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

  // Estrategia de passport para Github:
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.08050519f217277c",
        clientSecret: "e0a22b3c92b45bba317380e227cd29d9e5101de8",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          console.log(profile);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "Usuario",
              age: 36,
              email: profile._json.email,
              password: "antihack",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
