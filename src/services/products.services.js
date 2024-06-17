import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
const productDao = new ProductDaoMongoDB();

import fs from "fs";
import { __dirname } from "../utils/path.js";

export const createProductFile = async () => {
	try {
		const productsFile = JSON.parse(fs.readFileSync(`${__dirname}/data/¨products.json`, 'utf8'));
		const newProducts = await productDao.createProduct(productsFile);
		return newProducts.length;
	} catch (error) {
		throw new Error(error)
	}
}

export const getProductById = async (id) => {
	try {
		const prod = await productDao.getProductById(id);
		if (!prod) return false;
		else return prod;
	} catch (error) {
		throw new Error(error);
	}
};

export const getByTitle = async (title) => {
	try {
		return await productDao.getProductByTitle(title);
	} catch (error) {
		throw new Error(error);
	}
};

export const getByCode = async (code) => {
	try {
		return await productDao.getProductByCode(code);
	} catch (error) {
		throw new Error(error);
	}
};

export const getByCategory = async (category) => {
	try {
		return await productDao.getProductByCategory(category);
	} catch (error) {
		throw new Error(error);
	}
};

export const getAllProducts = async (limit, page, query, sort, stock) => {
    try {
        return await productDao.getAllProducts(limit, page, query, sort, stock);
	} catch (error) {
		throw new Error(error);
	}
};

export const createProduct = async (obj) => {
	try {
		return await productDao.createProduct(obj);
	} catch (error) {
		if (error.code === 11000) { // Código de error de clave duplicada
            throw new Error('Duplicate key error: product code already exists');
        }
        throw new Error(error);
	}
};

export const updateProduct = async (id, obj) => {
	try {
		return await productDao.updateProduct(id, obj);
	} catch (error) {
		throw new Error(error);
	}
};

export const deleteProduct = async (id) => {
	try {
		return await productDao.deleteProduct(id);
	} catch (error) {
		throw new Error(error);
	}
}