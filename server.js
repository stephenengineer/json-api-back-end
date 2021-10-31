const { PORT = 5000 } = process.env;

const app = require("./app");

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}

app.listen(PORT, listener);
