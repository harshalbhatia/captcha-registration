const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())

app.set("view engine", "pug");

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/registration", (req, res) => res.render("registration"));
app.post("/registration", (req, res) => {
  res.json(req.body);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
