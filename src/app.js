require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose"); // Agregado para la conexión a MongoDB
const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require("./middlewares/errorHandler");

// Configuracion Middleware con el Servidor de Autorización
const autenticacion = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_URL,
  tokenSigningAlg: "RS256",
});

const app = express();
app.use(express.json());

// Conexión a la base de datos MongoDB con Mongoose
const uri = process.env.MONGO_DB; // URI de conexión a la base de datos MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión exitosa a la base de datos MongoDB"))
  .catch((err) =>
    console.error("Error al conectar a la base de datos MongoDB:", err)
  );

// Importamos el Router de Libros
const librosRouter = require("./routes/libros");

//Configuramos el middleware de autenticacion
app.use("/api/libros", autenticacion, librosRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

module.exports = app;
