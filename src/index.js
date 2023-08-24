const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8001;

const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/category.route');
const colorRoutes = require('./routes/color.route');
const sizeRoutes = require('./routes/size.route');
const feedbackRoutes = require('./routes/feedback.route');
const productRoutes = require('./routes/product.route');
const bannersRoutes = require('./routes/banners.route');
const blogRoutes = require('./routes/blog.route');
const orderRoutes = require('./routes/order.route');

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/color', colorRoutes);
app.use('/size', sizeRoutes);
app.use('/feed-back', feedbackRoutes);
app.use('/product', productRoutes);
app.use('/banners', bannersRoutes);
app.use('/blog', blogRoutes);
app.use('/order', orderRoutes);

app.listen(PORT, () => {
  console.log(`server is runing at port ${PORT}`);
});
