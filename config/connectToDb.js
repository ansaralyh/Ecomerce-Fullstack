const mongoose = require('mongoose');

const connectToDb = () => {
    mongoose.connect(process.env.MONGO_URI).then((data)=>{
        console.log(`Database connected wih server: ${data.connection.host}`)
    })

}
module.exports = connectToDb;