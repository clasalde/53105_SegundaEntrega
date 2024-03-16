const socket = io();

socket.on("productGallery", (data) => {
    renderProductos(data);
});

const renderProductos = (productos) => {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                <p>ID ${item._id} </p>
                <p class="bold">${item.title} </p>
                <p>${item.description} </p><br>
                <p class="bold big">$ ${item.price} </p>
                <button class="btn"> Eliminar </button>`;

        productContainer.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        });
    });
}

const eliminarProducto = (id) => {
    socket.emit("deleteProductFromGallery", id);
}

document.getElementById("btnSend").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };

    socket.emit("addProductToGallery", producto);
};