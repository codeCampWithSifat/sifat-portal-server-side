const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000 ;



// use the middleware
app.use(express.json())
app.use(cors())

app.get('/' ,(req,res) => {
    res.send('Hello Server side')
    console.log(`server side ok`)
})


app.listen(port ,() => {
    console.log(`Listening to the port ${port} successfully`)
})