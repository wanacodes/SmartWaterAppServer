const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/water/level', (req, res) => {
    // console.log(req.body)
    res.send('_t1849##_d180##_d280##');

})

app.listen(3000, () => {console.log("Listen to port 3000...")})