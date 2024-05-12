export const productsValidator = (req, res, next) => {
	if (
		req.body.title === undefined ||
		req.body.description === undefined ||
		req.body.code === undefined ||
		req.body.price === undefined ||
		req.body.stock === undefined ||
		req.body.category === undefined
	) res.status(404).json({ msg: 'Se deben completar todos los campos' });
	else next()
}