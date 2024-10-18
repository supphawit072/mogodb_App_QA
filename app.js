const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
// const cors = require('cors');

dotenv.config();

// Middleware สำหรับ parse JSON
app.use(express.json());

const MONGO_DB_URL = process.env.MONGO_DB_URL;

mongoose.connect(MONGO_DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// นำเข้าเส้นทาง (routes)
// const productRoutes = require('./routes/product');
// const authRoutes = require('./routes/auth');

// ใช้เส้นทาง (routes)
// app.use('/api/', productRoutes);
// app.use('/api/auth', authRoutes);

// admin register
const authRoute = require('./routes/adminAuth');
app.use('/api/admin/auth',authRoute);

// admin controll user
const userRouter = require('./routes/adminaction');
app.use('/api/user',userRouter);



// admin controll course
const courseRouter = require('./routes/adminaction');
app.use('/api/course',courseRouter);

// admin controllers form
const formRouter = require('./routes/adminaction');
app.use('/api/form',formRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
