require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

var data = {};
let currId = 0;
const parseUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
};
app.post("/api/shorturl", function (req, res) {
  const urlString = req.body["url"];
  if (parseUrl(urlString) === false) {
    return res.json({ error: "Invalid URL" });
  }

  const url = new URL(urlString);
  dns.lookup(url.body, (err, address, _) => {
    if (err) {
      return res.json({ error: "Invalid URL" });
    }
    data[currId] = url;
    return res.json({ original_url: url, short_url: currId++ });
  });
});

app.get("/api/shorturl/:id", function (req, res) {
  const id = parseInt(req.params["id"]);
  if (id in data) {
    return res.redirect(data[id]);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
