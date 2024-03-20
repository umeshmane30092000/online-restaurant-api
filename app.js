// step 1 : creating a server and connecting it to a databse

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/restaurent-api', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Define mongoose model
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
  }));
  
  const Order = mongoose.model('Order', new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    orderDate: {
      type: Date,
      default: Date.now
    }
  }));
  

//step 3 implementing api  endpoint

// Create a new product
app.post('/api/products', async (req, res) => {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });
    product = await product.save();
    res.send(product);
  });
  
  // Get all products
  app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
  });
  
  // Update a product
  app.put('/api/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    }, { new: true });
  
    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
  });
  
  // Delete a product
  app.delete('/api/products/:id', async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
  
    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
  });

  app.post('/api/orders', async (req, res) => {
    let order = new Order({
      productId: req.body.productId,
      quantity: req.body.quantity
    });
    order = await order.save();
    res.send(order);
  });

app.get('/', (req, res) => {
    res.json({message:"it is working"});
})
  
  