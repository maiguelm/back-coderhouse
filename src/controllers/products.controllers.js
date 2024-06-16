import * as productsServices from "../services/products.services.js";
import mongoose from "mongoose";

export const getProductById = async (req, res, next) => {
    try {
        const { idProd } = req.params;
        const response = await productsServices.getProductById(idProd);
        if (!response) res.status(404).json({ msg: "Product Not found!" });
        else res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// Controlador para obtener productos por título
export const getProductByTitle = async (req, res, next) => {
    try {
        const title = req.params.title;
        const products = await productsServices.getByTitle(title);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductByCode = async (req, res, next) => {
    try {
        const code = req.params.code;
        const products = await productsServices.getByCode(code);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const products = await productsServices.getByCategory(category);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, query, sort, stock } = req.query;
        const response = await productsServices.getAllProducts(limit, page, query, sort, stock);
        const nextLink = response.hasNextPage ? `http://localhost:8080/api/products?page=${response.nextPage}` : null;
        const prevLink = response.hasPrevPage ? `http://localhost:8080/api/products?page=${response.prevPage}` : null;
        res.status(200).json({
            status: 'success',
            payload: response.docs,
            totalPage: response.totalPages,
            prevPage: response.prevPage,
            page: response.page,
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = req.body;
        const createdProduct = await productsServices.createProduct(newProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.idProd;
        const updatedProductData = req.body;
        const updatedProduct = await productsServices.updateProduct(id, updatedProductData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.idProd;
        await productsServices.deleteProduct(id);
        console.log("producto eliminado con exito")
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
