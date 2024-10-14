import express from "express";
import morgan from "morgan";
import handlebars from "express-handlebars";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import path from "path";
import { __dirname } from "./utils/path.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
// import emailRouter from "./routes/email.router.js";
import { initMongoDB } from "./daos/mongodb/connection.js";
import "dotenv/config";
import * as productsServices from "./services/products.services.js";
import authRouter from "./routes/auth.router.js";
import sessionsRouter from "./routes/sessions.routes.js"
import { authenticateJWT } from "./middlewares/authMiddleware.js";

import session from "express-session";
import passport from "passport";
import { configurePassport } from "./middlewares/passport.js";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(authenticateJWT);

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_PASSPORT,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    },
  })
);


configurePassport();
app.use(passport.initialize());
app.use(passport.session());

const hbs = handlebars.create({
  helpers: {
    eq: (a, b) => a === b,
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/auth", authRouter);
// app.use("/mail", emailRouter);

app.use(errorHandler);

if (process.env.PERSISTENCE === "MONGO") initMongoDB();
const PORT = 8080;

let products = [];

export const loadProductsIndex = async (limit) => {
  const response = await productsServices.getAllProducts((limit = 15));
  products = response.docs;
  return products.docs;
};

server.listen(PORT, async () => {
  await loadProductsIndex();
  console.log(`Server en puerto ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Conexión con éxito");

  socket.emit("chargeProducts", products);

  socket.on("addProduct", async (prod) => {
    try {
      const newProduct = await productsServices.createProduct(prod);
      products.push(newProduct);
      console.log("Se agregó un producto", newProduct);
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("removeProduct", async (prodId) => {
    await productsServices.deleteProduct(prodId);
    products = products.filter((p) => p._id.toString() !== prodId);
    io.emit("updateProducts", products);
  });

  socket.on("updateProduct", async (prod) => {
    console.log("Product ID to update:", prod.id);
    const updatedProduct = await productsServices.updateProduct(prod.id, prod);
    products = products.map((p) =>
      p._id.toString() === prod.id ? updatedProduct : p
    );
    io.emit("updateProducts", products);
  });

  socket.on("disconnect", () => {
    console.log("Desconexión con éxito");
  });

  socket.on('cartUpdated', (totalQuantity) => {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = totalQuantity;
    }
  });
});

export { io, products };
