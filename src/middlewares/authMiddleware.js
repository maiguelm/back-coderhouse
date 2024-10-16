import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
	console.log('Usuario:', req.user)
	if (req.user && req.user.role === 'admin') {
		return next();
	}
	return res.status(403).send({ message: 'No autorizado' });
};

export const isUser = (req, res, next) => {
	if (req.user && req.user.role === 'user') {
		return next();
	}
	return res.status(403).send({ message: 'No autorizado' });
};

export const authenticateJWT = (req, res, next) => {
	const token = req.cookies?.token; 
	if (!token) {
		req.user = null;
		return next();
	}

	jwt.verify(token, process.env.SECRET_PASSPORT, (err, decoded) => {
		if (err) {
			req.user = null;
			return next();
		}

		req.user = decoded;
		next();
	});
};