// BASE DE DATOS:
// Instalación de mongoose: npm i mongoose.
// Importación del módulo de mongoose:
import mongoose from "mongoose";
// Conexión a la base de datos de Atlas en la nube con un then y catch, este último en caso que haya que atrapar un error:
mongoose
  .connect(
    "mongodb+srv://mchouhy:coderhouse@cluster0.uc50yks.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conectado a la base de datos de Mongo Atlas"))
  .catch(() =>
    console.log(
      "Error al intentar conectarse a la base de datos de Mongo Atlas."
    )
  );
