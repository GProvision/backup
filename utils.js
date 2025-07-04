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
// filtrar por el numero de afiliado de la ficha
