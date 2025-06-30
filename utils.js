import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "./generated/prisma/client/index.js";
const prisma = new PrismaClient();

const utils = {};

const saveToJSON = (data, model) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, "./data", `${model}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const getInfoFromJSON = (model) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, "./data", `${model}.json`);
  return JSON.parse(readFileSync(filePath, "utf-8"));
};

utils.getArchivos = async (req, res) => {
  try {
    const archivos = await prisma.archivos.findMany();
    saveToJSON(archivos, "archivos");
    res.json(archivos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};
utils.getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        activo: 1,
      },
    });
    const data = await Promise.all(
      usuarios.map(async (usuario) => {
        const rol = await prisma.rol.findUnique({
          where: {
            id_rol: usuario.id_rol,
          },
        });
        return {
          ...usuario,
          rol,
        };
      })
    );
    saveToJSON(data, "usuarios");
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getFichas = async (req, res) => {
  try {
    const tipo = req.params.tipo;
    if (tipo === "cc") {
      let fichasCC = await prisma.fichas.findMany({
        select: {
          id_ficha: true,
          nro_pedido: true,
          fecha: true,
          estado: true,
          tipo_lente: true,
          es_casa_central: true,
          id_cliente: true,
          id_sindicato: true,
          id_delegacion: true,
          id_optica: true,
          voucher: true,
          id_stock: true,
          codigo_armazon: true,
          color_armazon: true,
        },
        where: {
          fecha: {
            gte: new Date(2025, 0, 0),
          },
          estado: {
            in: ["1", "2", "3", "4", "5", "6", "7"],
          },
          activo: {
            equals: 1,
          },
          es_casa_central: {
            equals: 1,
          },
        },
        orderBy: {
          id_ficha: "asc",
        },
      });
      fichasCC = await Promise.all(
        fichasCC.map(async (ficha) => {
          const cliente = await prisma.clientes.findUnique({
            where: {
              id_cliente: ficha.id_cliente,
            },
          });
          let optica = await prisma.opticas.findUnique({
            where: {
              id_optica: ficha.id_optica,
            },
          });
          if (optica) {
            optica.delegacion = await prisma.delegacion.findUnique({
              where: {
                id_delegacion: optica.id_delegacion,
              },
            });
          }
          let stock = await prisma.stock.findUnique({
            where: {
              id_stock: ficha.id_stock,
            },
          });
          if (stock) {
            stock.material = await prisma.material.findUnique({
              where: {
                id: stock.id_material,
              },
            });
            stock.tipo_armazon = await prisma.tipo_armazon.findUnique({
              where: {
                id_tipo_armazon: stock.id_tipo_armazon,
              },
            });
            stock.ubicacion = await prisma.ubicacion.findUnique({
              where: {
                id: stock.id_ubicacion,
              },
            });
          }
          const sindicato = await prisma.sindicatos.findUnique({
            where: {
              id_sindicato: ficha.id_sindicato,
            },
          });
          const delegacion = await prisma.delegacion.findUnique({
            where: {
              id_delegacion: ficha.id_delegacion,
            },
          });
          const tipoLente = await prisma.tipo_lentes.findUnique({
            where: {
              id: ficha.tipo_lente,
            },
          });
          return {
            ...ficha,
            cliente,
            optica,
            stock,
            sindicato,
            delegacion,
            tipoLente,
          };
        })
      );
      saveToJSON(fichasCC, "fichasCC");
      res.json({ fichasCC: "guardado" });
    } else if (tipo === "no_cc") {
      let fichasNoCC = await prisma.fichas.findMany({
        select: {
          id_ficha: true,
          nro_pedido: true,
          fecha: true,
          estado: true,
          grad_od_esf: true,
          grad_od_cil: true,
          eje_od: true,
          grad_oi_esf: true,
          grad_oi_cil: true,
          eje_oi: true,
          tipo_lente: true,
          es_casa_central: true,
          id_cliente: true,
          id_sindicato: true,
          id_delegacion: true,
          id_optica: true,
          voucher: true,
          id_stock: true,
          codigo_armazon: true,
          color_armazon: true,
        },
        where: {
          fecha: {
            gte: new Date(2025, 0, 0),
          },
          estado: {
            in: ["1", "2", "3", "4", "5", "6", "7"],
          },
          activo: {
            equals: 1,
          },
          es_casa_central: {
            equals: 0,
          },
        },
        orderBy: {
          id_ficha: "asc",
        },
      });
      fichasNoCC = await Promise.all(
        fichasNoCC.map(async (ficha) => {
          const cliente = await prisma.clientes.findUnique({
            where: {
              id_cliente: ficha.id_cliente,
            },
          });
          let optica = await prisma.opticas.findUnique({
            where: {
              id_optica: ficha.id_optica,
            },
          });
          if (optica) {
            optica.delegacion = await prisma.delegacion.findUnique({
              where: {
                id_delegacion: optica.id_delegacion,
              },
            });
          }
          let stock = await prisma.stock.findUnique({
            where: {
              id_stock: ficha.id_stock,
            },
          });
          if (stock) {
            stock.material = await prisma.material.findUnique({
              where: {
                id: stock.id_material,
              },
            });
            stock.tipo_armazon = await prisma.tipo_armazon.findUnique({
              where: {
                id_tipo_armazon: stock.id_tipo_armazon,
              },
            });
            stock.ubicacion = await prisma.ubicacion.findUnique({
              where: {
                id: stock.id_ubicacion,
              },
            });
          }
          const sindicato = await prisma.sindicatos.findUnique({
            where: {
              id_sindicato: ficha.id_sindicato,
            },
          });
          const delegacion = await prisma.delegacion.findUnique({
            where: {
              id_delegacion: ficha.id_delegacion,
            },
          });
          const tipoLente = await prisma.tipo_lentes.findUnique({
            where: {
              id: ficha.tipo_lente,
            },
          });
          return {
            ...ficha,
            cliente,
            optica,
            stock,
            sindicato,
            delegacion,
            tipoLente,
          };
        })
      );
      saveToJSON(fichasNoCC, "fichasNoCC");
      res.json({ fichasNoCC: "guardado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getStock = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let stock = fichasCC.flatMap((ficha) => ficha.stock);
    stock = stock.concat(fichasNoCC.flatMap((ficha) => ficha.stock));
    stock = stock.filter((stock) => stock !== null && stock !== 0);
    stock = stock.map((stock) => ({
      id_stock: stock.id_stock,
      cantidad: stock.cantidad,
      material: stock.material.descripcion,
      tipo_armazon: stock.tipo_armazon.descripcion,
      ubicacion: stock.ubicacion.descripcion,
      activo: stock.activo,
      codigo_platilla: stock.codigo_platilla,
      codigo_color: stock.codigo_color,
      descripcion_color: stock.descripcion_color,
      nro_codigo_interno: stock.nro_codigo_interno,
      letra_color_interno: stock.letra_color_interno,
      cantidad_minima: stock.cantidad_minima,
      costo: stock.costo,
      precio_venta: stock.precio_venta,
    }));
    // Eliminar registros repetidos
    stock = stock.filter(
      (stock, index, self) =>
        self.findIndex((t) => t.id_stock === stock.id_stock) === index
    );
    stock.sort((a, b) => a.id_stock - b.id_stock);
    stock = stock.map((stock) => ({
      id: stock.id_stock,
      cantidad: stock.cantidad,
      material: stock.material,
      tipo_armazon: stock.tipo_armazon,
      ubicacion: stock.ubicacion,
      activo: stock.activo,
      codigo_platilla: stock.codigo_platilla,
      codigo_color: stock.codigo_color,
      descripcion_color: stock.descripcion_color,
      nro_codigo_interno: stock.nro_codigo_interno,
      letra_color_interno: stock.letra_color_interno,
      cantidad_minima: stock.cantidad_minima,
      costo: stock.costo,
      precio_venta: stock.precio_venta,
    }));
    saveToJSON(stock, "stock");
    res.json({ stock: stock.map((stock) => stock.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getTipoLentes = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let lentes = fichasCC.flatMap((ficha) => ficha.tipoLente);
    lentes = lentes.concat(fichasNoCC.flatMap((ficha) => ficha.tipoLente));
    lentes = lentes.filter((lentes) => lentes !== null && lentes !== 0);
    lentes = lentes.map((lentes) => ({
      id: lentes.id,
      descripcion: lentes.descripcion,
    }));
    // Eliminar registros repetidos
    lentes = lentes.filter(
      (lentes, index, self) =>
        self.findIndex((t) => t.id === lentes.id) === index
    );
    lentes.sort((a, b) => a.id - b.id);
    saveToJSON(lentes, "tipoLentes");
    res.json({ tipoLentes: lentes.map((lentes) => lentes.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getSindicatos = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let sindicatos = fichasCC.flatMap((ficha) => ficha.sindicato);
    sindicatos = sindicatos.concat(
      fichasNoCC.flatMap((ficha) => ficha.sindicato)
    );
    sindicatos = sindicatos.filter(
      (sindicatos) => sindicatos !== null && sindicatos !== 0
    );
    sindicatos = sindicatos.filter(
      (sindicatos, index, self) =>
        self.findIndex((t) => t.id_sindicato === sindicatos.id_sindicato) ===
        index
    );
    sindicatos.sort((a, b) => a.id_sindicato - b.id_sindicato);
    saveToJSON(sindicatos, "sindicatos");
    res.json({ sindicatos: sindicatos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getDelegacion = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let delegacion = fichasCC.flatMap((ficha) => ficha?.delegacion);
    delegacion = delegacion.concat(
      fichasNoCC.flatMap((ficha) => ficha?.delegacion)
    );
    delegacion = delegacion.filter(
      (delegacion) => delegacion !== null && delegacion !== 0
    );
    delegacion = delegacion.filter(
      (delegacion, index, self) =>
        self.findIndex(
          (t) => t?.id_delegacion === delegacion?.id_delegacion
        ) === index
    );
    let opticas = fichasCC.flatMap((ficha) => ficha?.optica?.delegacion);
    opticas = opticas.concat(
      fichasNoCC.flatMap((ficha) => ficha?.optica?.delegacion)
    );
    opticas = opticas.filter((optica) => optica !== null && optica !== 0);
    delegacion = delegacion.concat(opticas);
    delegacion = delegacion.filter(
      (delegacion, index, self) =>
        self.findIndex(
          (t) => t?.id_delegacion === delegacion?.id_delegacion
        ) === index
    );
    delegacion = delegacion.map((delegacion) => ({
      id: delegacion?.id_delegacion,
      descripcion: String(delegacion?.descripcion).trim(),
      activo: delegacion?.activo,
    }));
    delegacion.sort((a, b) => a.id - b.id);
    saveToJSON(delegacion, "delegacion");
    res.json({ delegacion: delegacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getRoles = async (req, res) => {
  try {
    let usuarios = getInfoFromJSON("usuarios");
    let roles = usuarios.map((usuario) => usuario.rol);
    roles = roles.filter((roles) => roles !== null && roles !== 0);
    roles = roles.filter(
      (roles, index, self) =>
        self.findIndex((t) => t.id_rol === roles.id_rol) === index
    );
    roles = roles.map((roles) => ({
      id: roles.id_rol,
      descripcion: String(roles.descripcion).trim(),
    }));
    roles.sort((a, b) => a.id - b.id);
    saveToJSON(roles, "roles");
    res.json({ roles: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getClientes = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let clientes = fichasCC.flatMap((ficha) => ficha.cliente);
    clientes = clientes.concat(fichasNoCC.flatMap((ficha) => ficha.cliente));
    clientes = clientes.filter(
      (clientes) => clientes !== null && clientes !== 0
    );
    clientes = clientes.filter(
      (clientes, index, self) =>
        self.findIndex((t) => t.id_cliente === clientes.id_cliente) === index
    );
    clientes = clientes.map((clientes) => ({
      id: clientes.id_cliente,
      titular_cliente: String(clientes.titular_cliente).trim(),
      beneficiario_cliente: String(clientes.beneficiario_cliente).trim(),
      nro_cliente: String(clientes.nro_cliente).trim(),
      dni: String(clientes.dni).trim(),
      id_sindicato: clientes.id_sindicato_cliente,
      activo: clientes.activo,
    }));
    clientes.sort((a, b) => a.id - b.id);
    saveToJSON(clientes, "clientes");
    res.json({ clientes: clientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getOpticas = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let delegacion = getInfoFromJSON("delegacion");
    let opticas = fichasCC.flatMap((ficha) => ficha.optica);
    opticas = opticas.concat(fichasNoCC.flatMap((ficha) => ficha.optica));
    opticas = opticas.filter((opticas) => opticas !== null && opticas !== 0);
    opticas = opticas.filter(
      (opticas, index, self) =>
        self.findIndex((t) => t.id_optica === opticas.id_optica) === index
    );
    opticas = opticas.map((opticas) => ({
      id: opticas.id_optica,
      optica: String(opticas.descripcion).trim(),
      id_delegacion: delegacion.find(
        (delegacion) => delegacion.id === opticas.id_delegacion
      )?.id,
      activo: opticas.activo,
    }));
    opticas.sort((a, b) => a.id - b.id);
    saveToJSON(opticas, "opticas");
    res.json({ opticas: opticas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

utils.getAllFichas = async (req, res) => {
  try {
    let fichasCC = getInfoFromJSON("fichasCC");
    let fichasNoCC = getInfoFromJSON("fichasNoCC");
    let fichas = fichasCC.concat(fichasNoCC);
    fichas.sort((a, b) => a.id_ficha - b.id_ficha);
    fichas = fichas.map((ficha) => ({
      id: ficha?.id_ficha,
      nro_pedido: ficha?.nro_pedido,
      fecha: ficha?.fecha,
      estado: ficha?.estado,
      grad_od_esf: ficha?.grad_od_esf || "",
      grad_od_cil: ficha?.grad_od_cil || "",
      eje_od: ficha?.eje_od || "",
      grad_oi_esf: ficha?.grad_oi_esf || "",
      grad_oi_cil: ficha?.grad_oi_cil || "",
      eje_oi: ficha?.eje_oi || "",
      es_casa_central: ficha?.es_casa_central,
      voucher: ficha?.voucher,
      codigo_armazon: ficha?.codigo_armazon,
      color_armazon: ficha?.color_armazon,
      id_tipo_lente: ficha?.tipo_lente,
      id_cliente: ficha?.id_cliente,
      id_sindicato: ficha?.id_sindicato,
      id_delegacion: ficha?.id_delegacion,
      id_optica: ficha?.id_optica,
      id_stock: ficha?.id_stock,
      activo: ficha?.activo,
      tipo_lente: getInfoFromJSON("tipoLentes").find(
        (tipo_lente) => tipo_lente.id === ficha?.tipo_lente
      ),
      cliente: getInfoFromJSON("clientes").find(
        (cliente) => cliente.id === ficha?.id_cliente
      ),
      sindicato: getInfoFromJSON("sindicatos").find(
        (sindicato) => sindicato.id === ficha?.id_sindicato
      ),
      delegacion: getInfoFromJSON("delegacion").find(
        (delegacion) => delegacion.id === ficha?.id_delegacion
      ),
      optica: getInfoFromJSON("opticas").find(
        (optica) => optica.id === ficha?.id_optica
      ),
      stock: getInfoFromJSON("stock").find(
        (stock) => stock.id === ficha?.id_stock
      ),
    }));
    saveToJSON(fichas, "fichas");
    res.json({ fichas: fichas.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

export default utils;
