import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
    const connection = await mongoose.connect(`mongodb+srv://vadodarahackath_db_user:vadodarahack@cluster0.bcvnxfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    console.log(`mongodb connected ${connection.connection.host}`)
        
    } catch (error) {
        console.log("mongodb connection error",error)
        process.exit(1)
    }
}
export default connectDB;