import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`❌ MongoDB connection error: ${error.message}`);
  }
};

export default connectToDatabase;



//mongodb+srv://servocci:malik_merchants_321@servoccicluster.6bnm6xh.mongodb.net/?retryWrites=true&w=majority&appName=ServocciCluster
