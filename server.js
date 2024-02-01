const app = require('./app');
const dotenv = require('dotenv');
const connectToDb = require('./config/connectToDb');

// handling uncaught errors
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`)
    process.exit(1);

})


dotenv.config({ path: "config/config.env" })
// connecting to server
const server = app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on port  http://localhost:${process.env.PORT}`);
});

connectToDb();

//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1);
    });
})