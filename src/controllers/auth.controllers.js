import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../daos/mongodb/models/user.model.js";

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("users/register", { error: "El usuario ya existe" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRET_PASSPORT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/");
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return res
      .status(500)
      .render("users/register", { error: "Error al registrar el usuario" });
  }
};

export const renderLoginView = (req, res) => {
  res.render("users/login");
};

export const renderRegisterView = (req, res) => {
  res.render("users/register");
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).render("login", { error: "Usuario no encontrado" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).render("login", { error: "Contraseña incorrecta" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_PASSPORT,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  return res.redirect("/");
};
