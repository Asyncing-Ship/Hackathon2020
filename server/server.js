const express = require("express");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");

// Route includes

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes */
app.use(express.static("public"));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  console.log(Date());
});
