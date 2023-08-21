const express = require('express')
const ProductManager = require('./ProductManager.js')
const productManager = new ProductManager('./src/productostest.json')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts()

    if (limit) {
        return res.send(products.slice(0, limit))
    }
    res.send(products)
})

app.get('/products/:pid', async (req, res) => {
    const product = parseInt(req.params.pid,10)
    const products = await productManager.getProductById(product)

    res.send(products)
})

app.listen(8080, ()=> console.log('servicio corriendo en el puerto 8080'))
