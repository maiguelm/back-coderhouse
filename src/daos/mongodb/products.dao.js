import { ProductModel } from "./models/product.model.js";
import mongoose from "mongoose";

export default class ProductDaoMongoDB {

	async getProductById(id) {
		try {
			const response = await ProductModel.findById(id);
			console.log(response);
			return response;
		} catch (error) {
			throw new Error(error);
		}
	};

	async getProductByTitle(title) {
		try {
			return await ProductModel.find({ title: title });
		} catch (error) {
			throw new Error(error);
		}
	};

	async getProductByCode(code) {
		try {
			return await ProductModel.find({ code: code });
		} catch (error) {
			throw new Error(error);
		}
	};

	async getProductByCategory(category) {
		try {
			return await ProductModel.find({ category: category });
		} catch (error) {
			throw new Error(error);
		}
	};

	async getAllProducts(limit = 10, page = 1, query, sort, stock) {
		try {
			let filter = {};
			if (query) {
				filter = { $or: [{ category: { $regex: query, $options: 'i' } }, { title: { $regex: query, $options: 'i' } }] };
			}
			if (stock !== undefined) {
				filter.stock = { $gte: parseInt(stock) };
			}

			let order = {};
			if (sort) order.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;

			const response = await ProductModel.paginate(filter, {
				page: parseInt(page),
				limit: parseInt(limit),
				sort: order,
				lean: true
			});

			return response;
			// return await ProductModel.find({}).lean().limit(limit);
		} catch (error) {
			throw new Error(error);
		}
	};

	async createProduct(obj) {
		try {
			return await ProductModel.create(obj);
		} catch (error) {
			throw new Error(error);
		}
	};

	async updateProduct(id, obj) {
		try {
			const objectId = new mongoose.Types.ObjectId(id);
			const updProduct = await ProductModel.findByIdAndUpdate(objectId, obj, { new: true });
			console.log(updProduct)
			return updProduct;
		} catch (error) {
			throw new Error(error);
		}
	};

	async deleteProduct(id) {
		try {
			const objectId = new mongoose.Types.ObjectId(id);
			const response = await ProductModel.findByIdAndDelete(objectId);
			return response;
		} catch (error) {
			throw new Error(error);
		}
	};

}