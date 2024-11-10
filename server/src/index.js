const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRouter = require('./routes/student');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/student', studentRouter);

mongoose.connect("mongodb://localhost:27017/Student");

app.listen(3000, () => {
    console.log('app is running');
});
