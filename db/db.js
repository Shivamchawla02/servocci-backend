import mongoose from "mongoose";

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
    } catch(error){
        console.log(error)
    }
}

export default connectToDatabase;


//mongodb+srv://servocci:malik_merchants_321@servoccicluster.6bnm6xh.mongodb.net/?retryWrites=true&w=majority&appName=ServocciCluster
