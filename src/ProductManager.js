const fs = require('fs')


class ProductManager {
    path
    products = []

    constructor(path) {
        this.path = path
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            id: 0,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        if (title && description && price && thumbnail && code && stock) {
            try {
                if (!fs.existsSync(this.path)) {
                    this.products.push(product)
                    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
                }
                else {
                    const contenidoParse = await this.getProducts()
                    if (!contenidoParse.find((product) => product.code === code)) {
                        const maxId = await this.findMaxProductId();
                        product.id = maxId + 1
                        contenidoParse.push(product)
                        await fs.promises.writeFile(this.path, JSON.stringify(contenidoParse, null, '\t'))
                    }
                    else { console.log(`el código de producto ya existe.`) }
                }
            }
            catch (error) {
                console.log(`se ha producido el siguiente error: ${error}`)
            }
        }
        else { "todos lo campos del producto deben ser completados" }
    }

    async findMaxProductId() {
        try {
            const contenidoParse = await this.getProducts();
            let maxId = 0
            contenidoParse.forEach((product) => {
                if (product.id > maxId) {
                    maxId = product.id
                }
            })
            return maxId

        } catch (error) {
            console.log(`ocurrió un error buscando los id ${error}`);
        }
    }

    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                return this.products
            }
            else {
                const contenido = await fs.promises.readFile('./src/productostest.json','utf-8')
                const contenidoParse = JSON.parse(contenido)
                return contenidoParse
            }
        } catch (error) {
            console.log(`ocurrió un error buscando los productos ${error}`)
        }
    }

    async getProductById(id) {
        try {
            if (!fs.existsSync(this.path)) {
                console.log('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoParse = await this.getProducts()
                const producto = contenidoParse.find((product) => (product.id === id))
                if (producto)
                    return producto
                else
                    return(`Product Not found`)
            }
        }
        catch (error) {
            console.log(`se ha producido el siguiente error: ${error}`)
        }
    }

    async updateProduct(id, updateField, updateValue) {
        try {
            if (!fs.existsSync(this.path)) {
                console.log('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoParse = await this.getProducts()
                const productoIndex = contenidoParse.findIndex((product) => (product.id === id))
                if (productoIndex != -1) {
                    if (updateField === "title" || updateField === "description" || updateField === "price" || updateField === "thumbnail" || updateField === "code" || updateField === "stock") {
                        contenidoParse[productoIndex][updateField] = updateValue
                        await fs.promises.writeFile(this.path, JSON.stringify(contenidoParse, null, '\t'))
                        console.log(`Se ha actualizado el campo ${updateField} con valor ${updateValue} del producto con el id: ${id}`)
                    }
                    else {
                        console.log(`El campo "${updateField}" no existe`)
                    }
                }
                else
                    console.log(`No se encontró el producto con el id:${id}`)
            }
        }
        catch (error) {
            console.log(`se ha producido el siguiente error: ${error}`)
        }

    }

    async deleteProduct(id) {
        try {
            if (!fs.existsSync(this.path)) {
                console.log('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoParse = await this.getProducts()
                const producto = contenidoParse.find((product) => (product.id === id))
                if (producto) {
                    const nuevaLista = contenidoParse.filter((producto) => producto.id != id)
                    await fs.promises.writeFile(this.path, JSON.stringify(nuevaLista, null, '\t'))
                    console.log(`se ha eliminado el producto con id: ${id} de la lista`)
                }
                else
                    console.log(`El producto con el id: ${id} no existe, no se eliminó ningún producto`)
            }
        }
        catch (error) {
            console.log(`se ha producido el siguiente error: ${error}`)
        }

    }
}

module.exports = ProductManager

/* test 1: Se creará una instancia de la clase “ProductManager” */
const instanciaProductos = new ProductManager("./productostest.json")

/* test 2: Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [] */
/* instanciaProductos.getProducts().then(productos => console.log(productos)) */

/* test 3: Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”         
code:”abc123”,
stock:25
 */
/* instanciaProductos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25) */

/* test 4: Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado */
/* instanciaProductos.getProducts().then(productos=>console.log(productos)) */

/* test 5: Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, 
en caso de no existir, debe arrojar un error. */
/* instanciaProductos.getProductById(1).then(product => console.log(product)) */
/* instanciaProductos.getProductById(5).then(product => console.log(product)) */

/* test 6: Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto,
 se evaluará que no se elimine el id y que sí se haya hecho la actualización. */
/* instanciaProductos.updateProduct(0,"title","productocambiado") */
/* instanciaProductos.getProducts().then(productos=>console.log(productos)) */

/* test 7 :  Se llamará al método “deleteProduct”,
se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir*/
/* instanciaProductos.deleteProduct(0) */
/* instanciaProductos.deleteProduct(20) */
/* instanciaProductos.getProducts().then(productos=>console.log(productos)) */