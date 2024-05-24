import express from 'express';
import handlebars from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { __dirname } from './utils/path.js';
import { errorHandler } from './middlewares/errorHandler.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/product.manager.js';

const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.static(__dirname + '/../public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views',`${__dirname}/../views`);

app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);


app.use(errorHandler);

const PORT = 8080;


const productManager = new ProductManager(`${__dirname}/data/products.json`);

let products = [];

const loadProductsIndex = async () =>{
	products = await productManager.getProducts();
}
server.listen(PORT, async () => {
	await loadProductsIndex();
	console.log(`Server en puerto ${PORT}`)
});

io.on('connection', (socket) =>{
	console.log('conexion con exito');

	socket.emit('updateProducts', products);

	socket.on('addProduct', async (prod) =>{
		const newProduct = await productManager.addProduct(prod);
		products.push(newProduct);
		console.log('Se agregó un producto', newProduct);
		io.emit('updateProducts', products);
	});

	socket.on('removeProduct', (prodId) =>{
		products = products.filter((p) => p.id !== prodId);
		io.emit('updateProducts', products);
	})

	socket.on('disconnetc', () =>{
		console.log(' Desconexión con exito')
	})

})

export { io, products}