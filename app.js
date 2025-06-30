import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import utils from "./utils.js";
app.get("/archivos", utils.getArchivos);
app.get("/usuarios", utils.getUsuarios);
app.get("/fichas/:tipo", utils.getFichas);
app.get("/stock", utils.getStock);
app.get("/lentes", utils.getTipoLentes);
app.get("/sindicatos", utils.getSindicatos);
app.get("/delegacion", utils.getDelegacion);
app.get("/roles", utils.getRoles);
app.get("/clientes", utils.getClientes);
app.get("/opticas", utils.getOpticas);
app.get("/fichas", utils.getAllFichas);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
