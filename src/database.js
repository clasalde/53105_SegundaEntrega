import mongoose from "mongoose";

mongoose.connect("mongodb+srv://calasalde:desafio@cluster0.obskgp2.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB Connection OK"))
    .catch(() => console.log("DB Connection ERROR"))