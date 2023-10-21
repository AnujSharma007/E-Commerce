const app = require('./app');

const dotenv = require('dotenv');
const databaseConnection = require('./config/database');


// unCaught Error

process.on("uncaughtException",(err)=>{
    console.log(`UnCaught Error: ${err.message}`)
    console.log('shutting down the server due to Uncaught Error')

    process.exit(1);
})


//config
dotenv.config({path:'./config/config.env'});


console.log(process.env.KEY)
databaseConnection();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is up and running on ${process.env.PORT}`)
})

// Unhandled Promise Rejection

process.on('unhandledRejection',err=>{
    console.log(`Error: ${err}`)
    console.log('shutting down the server due to unhandled Rejection')

    server.close(()=>{
        process.exit(1);
    })
})