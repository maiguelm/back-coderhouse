import { Router } from "express";
import * as productsServices from "../services/products.services.js";
import jwt from "jsonwebtoken";
import User from "../daos/mongodb/models/user.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 15;
    const response = await productsServices.getAllProducts(limit);
    const products = response.docs;

    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_PASSPORT);
        user = await User.findById(decoded.id)
      } catch (error) {
        console.error("Token inválido o expirado:", error);
      }
    }

    res.render("home", { products, loggedIn: !!user, user });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar los productos");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
