import express from "express";
import http from "http";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import ProductManager from "./controllers/product-manager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import chatsRouter from "./routes/chats.router.js";
import multer from "multer";
import MessageModel from "./models/message.model.js";
import "./database.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const PUERTO = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Handlebars Config
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chats", chatsRouter);
app.use("/", viewsRouter);

//Upload images with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.array("kamado"), (req, res) => {
    res.send("Image uploaded!");
});

//Server Port
server.listen(PUERTO, () => {
    console.log(`Server running on port: ${PUERTO}`);
});

//Real Time Server
const productManager = new ProductManager();

io.on("connection", async (socket) => {
    console.log("New client connected");

    socket.emit("productGallery", await productManager.getProducts());

    socket.on("deleteProductFromGallery", async (id) => {
        await productManager.deleteProduct(id);
        io.emit("productGallery", await productManager.getProducts());
    });

    socket.on("addProductToGallery", async (producto) => {
        await productManager.addProduct(producto);
        io.emit("productGallery", await productManager.getProducts());
    });
});


//Chat
io.on("connection", (socket) => {
    console.log("Un cliente conectado");

    socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        io.sockets.emit("message", messages);
    })
});