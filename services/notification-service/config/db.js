// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const dbURI = process.env.MONGO_URI; // assuming you use an env variable
//         if (!dbURI) {
//             throw new Error('MongoDB URI is undefined');
//         }
//         await mongoose.connect(dbURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB Connected');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1); // exit the process if connection fails
//     }
// };

// module.exports = connectDB;