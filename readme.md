# Proyeto de Backend, Segunda Parte, del curso de CoderHouse: Programación Backend II: Diseño y Arquitectura Backend

Entrega final de la segunda parte del proyecto del Curso de Programacion Backend de CoderHouse. Se trata de un pequeño e-commerce de productos de pasteleria-panaderia. Se van a poder crear usuarios, iniciar sesiones y, dependiendo del rol del usuario realizar las siguientes acciones:
- Si el usuario es "admin" podrá manipular la base de datos en cuanto a agregar-quitar productos.-
- Si el usuario es "user" podrá realizar compras en la aplicacion.-
El rol admin deberá ser cargado en Mongo DB, ya que desde la vista del Front no está prevista la posibilidad de determinar el rol del usuario. Tambien puede ser creado el usuario desde Postman, a traves de un post a localhost:8080/auth/register (o al puerto que se determine localmente), mediante una consulta del siguiente tipo:
{
    "first_name": "xxxxxx",
    "last_name": "xxxxx",
    "email": "xxxxx",
    "age": "xxx",
    "password": "xxxx",
    "role": "admin"
}

Los productos podrán ser agregados, eliminados o modificados desde la vista del navegador o desde consultas desde Postman.-
Sin embargo, tanto la posibilidad de agregar productos al carrito, la visualacion de los mismos o la compra del carrito; hasta el momento solo se manejan desde Postman.-


## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribución](#contribución)

## Características

- Gestión de carritos de compra
- Procesamiento de compras
- Envío de correos electrónicos con resúmenes de compra
- Autenticación de usuarios
- Interfaz de usuario dinámica

## Tecnologías Utilizadas

- **Backend:** 
  - Node.js
  - Express
  - MongoDB (Mongoose)
  - Nodemailer
  - Passport.js (JWT)
  
- **Frontend:** 
  - Handlebars
  - HTML/CSS
  - JavaScript

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/maiguelm/back-coderhouse.git
   cd back-coderhouse

2. Instala las dependencias:
npm install

3. Configura el archivo .env:

Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables de entorno:
MONGO_URL
PERSISTENCE
SECRET_PASSPORT
JWT_SECRET
MAIL_SECRET
USER_EMAIL

## Uso
Inicia el servidor con los comandos "npm start" o "npm run dev"

Accede a la aplicación en tu navegador en http://localhost:<your-port>.

Utiliza la interfaz para gestionar productos y usuarios.
Sin embargo, para la gestion de carritos, se deben hacer consultas en Postman o software similar, a las siguientes rutas:
POST: http://localhost:<your-port>/auth/login -- A los fines de iniciar sesion
POST: http://localhost:<your-port>/api/carts -- A los fines de crear un carrito
POST: http://localhost:<your-port>/api/carts/:idCart/product/:idProduct -- se debe ingresar el id del carrito para agregarle al mismo el producto cuyo id tambien debe ser ingresado
POST: http://localhost:<your-port>/api/carts/idCart/purchase -- Si se inició sesion, se creó el carrito y se agregaron productos; a través de esta consulta se realizará la compra.-

Realizada la compra, le llegará al usuario un correo electrónico con detalles de la misma, y se cargará en la BD el ticket de la compra.-