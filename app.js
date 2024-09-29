const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());


const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api', projectRoutes);

const projectMemberRoutes = require('./routes/projectMemberRoutes');
app.use('/api', projectMemberRoutes);

const errorRoutes = require('./routes/errorRoutes');
app.use('/api', errorRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await sequelize.authenticate();
    console.log('Database connected!');
});
