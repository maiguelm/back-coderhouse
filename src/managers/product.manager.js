import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit) {

        try {
            if (fs.access(this.path)) {
                const productsFile = await fs.readFile(this.path, "utf8");
                let products = JSON.parse(productsFile);

                if (limit && Number.isInteger(parseInt(limit))) {
                    products = products.slice(0, parseInt(limit));
                    return products;

                } else {
                    return products;
                }
            }
            return [];
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductsById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            return null;
        }
    }

    async addProduct(prod) {
        try {
            const id = uuidv4();

            const product = {
                id: id,
                status: true,
                ...prod
            };

            const products = await this.getProducts();

            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Producto agregado correctamente:');
            console.table(product);
            return product
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
        }
    }

    async updateProduct(prod, id) {
        try {
            let products = await this.getProducts();
            const find = products.findIndex(product => product.id === id);

            if (find === -1) return null;

            products[find] = { ...products[find], ...prod };

            await fs.writeFile(this.path, JSON.stringify(products));

            return products[find];
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        if (products.length > 0) {
          const productExist = await this.getProductsById(id);
          if (productExist) {
            const newArray = products.filter((u) => u.id !== id);
            await fs.writeFile(this.path, JSON.stringify(newArray));
            console.log("Producto eliminado existosamente")
            return productExist
          } 
        } else return null
      }

      async deleteData() {
        try {
            await fs.unlink(this.path);
            console.log("Archivo eliminado");
        } catch (error) {
            console.error("Error al eliminar el archivo:", error);
        }
    }
}
