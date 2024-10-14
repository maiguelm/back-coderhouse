import nodemailer from 'nodemailer';

export const sendPurchaseEmail = async (userEmail, ticket, products) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.MAIL_SECRET
    },
	tls: {
		rejectUnauthorized: false, // Desactiva la verificación de certificados
	  },
  });

  const productList = products.map(product => 
    `<li>${product.title} - Cantidad: ${product.quantity} - Precio: $${product.price}</li>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Resumen de tu compra',
    html: `
      <h1>Gracias por tu compra</h1>
      <p>Este es el resumen de tu compra:</p>
      <ul>
        ${productList}
      </ul>
      <p>Total pagado: $${ticket.amount}</p>
      <p>Código de ticket: ${ticket.code}</p>
      <p>Fecha de la compra: ${ticket.purchaseDate}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente a', userEmail);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};