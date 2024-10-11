import * as ProductService from '../services/products.services.js';
import * as CartService from '../services/cart.services.js';

import jwt from "jsonwebtoken";
import User from "../daos/mongodb/models/user.model.js";

export const getHome = async (req, res) => {
  try {
    const limit = req.query.limit || 15;
    const { docs: products } = await ProductService.getAllProducts(limit); 

    // const user = req.user || {};
    const token = req.cookies.token;
    let user = req.user ? req.user : null;
    let cartItemCount = 0;

    if (token) {
            try {
              const decoded = jwt.verify(token, process.env.SECRET_PASSPORT);
              user = await User.findById(decoded.id)
            } catch (error) {
              console.error("Token inválido o expirado:", error);
            }
          }

    if (user && user._id) {
      const cart = await CartService.getCartById(user.cart); 
      cartItemCount = cart ? cart.products.length : 0;
    }

    res.render('home', {
      products,
      loggedIn: Boolean(user && user._id),
      user, 
      cartItemCount, 
    });
  } catch (error) {
    console.error('Error al cargar la página principal:', error);
    res.status(500).send('Error al cargar la página principal');
  }
};
