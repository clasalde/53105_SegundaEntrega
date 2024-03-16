const socket = io();

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Your Name?",
    input: "text",
    text: "Tell us your chat user",
    inputValidator: (value) => {
        return !value && "Please tell us your name to continue"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    console.log(user);
})

chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
})

socket.on("message", (data) => {
    let log = document.getElementById("messagesLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} says: ${message.message} <br>`;
    })
    log.innerHTML = messages;
})