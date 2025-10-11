import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client/index.js";
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
  // verificar conexion a base de datos
  try {
    await prisma.$connect();
    console.log("Conectado a la base de datos");
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

import {
  getFichas,
  getUtedyc,
  getTypesArmazones,
  getTypesMaterials,
  getUbicaciones,
  getTypesLens,
  getTypesStates,
} from "./utils.js";
app.get("/fichas", getFichas);
app.get("/utedyc", getUtedyc);
app.get("/tipos/armazones", getTypesArmazones);
app.get("/tipos/materiales", getTypesMaterials);
app.get("/tipos/ubicaciones", getUbicaciones);
app.get("/tipos/lentes", getTypesLens);

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Server running on port http://localhost:${process.env.PORT || 3001}`
  );
});
