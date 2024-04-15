// IMPORTACIONES:
// Importación de Express JS (https://expressjs.com/en/starter/hello-world.html):
import express from "express";
// Creación de la app que utilizará Express JS y Handlebars:
const app = express();
// Número de puerto del servidor:
const PORT = 8080;
// Importación del motor de plantillas Handlebars (https://www.npmjs.com/package/express-handlebars):
import { engine } from "express-handlebars";
// Importación de las rutas del api de productos:
import { productsApiRouter } from "./routes/api/products.api.router.js";
// Importación de las rutas del api de carts:
import { cartsApiRouter } from "./routes/api/carts.api.router.js";
// Importación de las rutas del api de sessions:
import sessionsApiRouter from "./routes/api/sessions.api.router.js";
// Importación de las rutas de products:
import { productsViewsRouter } from "./routes/products.views.router.js";
// Importación de las rutas de carts:
import { cartViewsRouter } from "./routes/cart.views.router.js";
// Importación de las rutas de session:
import { sessionViewsRouter } from "./routes/session.views.router.js";
// Importación de la conexión a la base de datos de Mongo Atlas:
import "./mongoDB.js";
// Importación de Express Session:
import session from "express-session";
// Importación de Mongo Connect para guardar las sesiones de usuario:
import MongoStore from "connect-mongo";

// MIDDLEWARES:
// Directorio raíz desde el cual Express servirá los archivos estáticos cuando se realicen solicitudes HTTP:
app.use(express.static("./src/public"));
// Middleware que permite analizar los cuerpos de las solicitudes con datos codificados en URL y hacerlos accesibles en req.body:
app.use(express.urlencoded({ extended: true }));
// Función que permite comunicarnos con el servidor en formato JSON:
app.use(express.json());
// Middleware de express session:
app.use(
  session({
    secret: "secretCoder",
    // Permite mantener la sesión abierta ante la inactividad del usuario:
    resave: true,
    // Guarda el objeto de sesión aún cuando el mismo no tenga ningún dato para contener:
    saveUninitialized: true,
    // Configuración de Mongo Store:
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://mchouhy:coderhouse@cluster0.uc50yks.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

// HANDLEBARS:
// Aplicación del motor de plantillas Handlebars a todos los archivos con la extensión ".handlebars":
app.engine("handlebars", engine());
// Renderización de las vistas de la aplicación a través de Handlebars:
app.set("view engine", "handlebars");
// Directorio raíz desde el cual deben leerse los archivos con la extensión ".handlebars":
app.set("views", "./src/views");

// RUTAS:
// Endpoint de la ruta de api products:
app.use("/api/products", productsApiRouter);
// Endpoint de la ruta de api carts:
app.use("/api/carts", cartsApiRouter);
// Endpoint de la ruta de api sessions:
app.use("/api/sessions", sessionsApiRouter);
// Endpoint de la ruta de vistas de products:
app.use("/products", productsViewsRouter);
// Endpoint de la ruta de vistas del cart:
app.use("/cart", cartViewsRouter);
// Endpoint de la ruta de session:
app.use("/session", sessionViewsRouter);

// RUTA MAIN DE LA APP:
app.get("/", (request, response) => {
  response.send("Bienvenido al ecommerce.");
});

// PUERTO:
// Función que escucha cualquier cambio en el servidor:
app.listen(PORT, () =>
  console.log(`Escuchando cualquier cambio en el puerto: localhost:${PORT}`)
);
