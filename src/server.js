import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js'
import { __dirname } from './path.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express()

app.use(express.static(__dirname + '/data'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);


app.use(errorHandler);

const PORT = 8080

app.listen(PORT, () => {
	console.log(`Server en puerto ${PORT}`)
});
