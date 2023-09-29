const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();


app.use(cors())
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/otp', otpRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
