import nodemailer from "nodemailer";

export const sendPurchaseEmail = async (userEmail, ticket, products) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.MAIL_SECRET,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log(products);

  const productList = products
    .map(
      (product) =>
        `<li>${product.title} - Cantidad: ${product.quantity} - Precio: $${product.price}</li>`
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Resumen de tu compra",
    html: `
	<h1>Gracias por tu compra</h1>
	<p>Este es el resumen de tu compra:</p>
	<ul>
    ${products
      .map((product) => `<li>${product.title} - $${product.price}</li>`)
      .join("")}
 	</ul>
	<p>Total pagado: $${ticket.amount}</p>
	<p>Código de ticket: ${ticket.code}</p>
	<p>Fecha y hora de la compra: ${
    ticket.purchase_datetime ? ticket.purchase_datetime.toLocaleString() : "No disponible"
  }</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a", userEmail);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};
