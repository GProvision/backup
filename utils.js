import { PrismaClient } from "./generated/prisma/client/index.js";
const prisma = new PrismaClient();

// fichas creadas en el año actual
export const getFichas = async (req, res) => {
  try {
    const where = {
      AND: [
        { activo: 1 },
        { fecha: { contains: String(new Date().getFullYear()) } },
        { beneficiario: { contains: String(req.query.beneficiario || "") } },
        { nro_cliente: { contains: String(req.query.cliente || "") } },
        { dni: { contains: String(req.query.dni || "") } },
      ],
    };
    let fichas = await prisma.fichas.findMany({
      where,
      orderBy: {
        beneficiario: "asc",
      },
      select: {
        dni: true,
        beneficiario: true,
        nro_cliente: true,
        fecha: true,
        voucher: true,
        tipo_lente: true,
        estado: true,
        nro_pedido: true,
      },
    });
    fichas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
    res.status(200).json(fichas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUtedyc = async (req, res) => {
  try {
    const where = {
      AND: [
        { activo: 1 },
        {
          fecha: {
            startsWith: "2025-07-",
          },
        },
        {
          id_sindicato: 13,
        },
        {
          dni: {
            notIn: ["0", "FALTA", "00", ""],
          },
        },
        {
          voucher: {
            not: "",
          },
        },
      ],
    };
    const options = {};
    options.where = where;
    options.select = {
      dni: true,
      voucher: true,
      fecha: true,
      nro_pedido: true,
    };
    let fichas = await prisma.fichas.findMany(options);
    res.status(200).json({ fichas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTypesArmazones = async (req, res) => {
  try {
    const types = await prisma.tipo_armazon.findMany({
      select: { descripcion: true },
    });
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTypesMaterials = async (req, res) => {
  try {
    const types = await prisma.material.findMany({
      select: { descripcion: true },
    });
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUbicaciones = async (req, res) => {
  try {
    const types = await prisma.ubicacion.findMany({
      select: { descripcion: true },
    });
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTypesLens = async (req, res) => {
  try {
    const types = await prisma.tipo_lentes.findMany({
      select: { descripcion: true },
    });
    res
      .status(200)
      .json([...new Set(types.map(({ descripcion }) => descripcion))]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStocks = async (req, res) => {
  try {
    const data = await prisma.stock.findMany({
      select: {
        codigo_patilla: true,
        codigo_color: true,
        nro_codigo_interno: true,
        letra_color_interno: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
