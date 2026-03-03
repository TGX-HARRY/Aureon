const http = require("http");
const app = require("./src/app");

const port = 1212;

app.listen(port, () => {
    console.log("API and Webpage live at http://localhost:1212");
})