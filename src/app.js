const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
require("./db/connection");
const ShortUrl = require("./models/url_shortener_model");
const shortid = require("shortid");

// setting up hbs files
const templatePath = path.join(__dirname, "./templates/views");
app.set("view engine", "ejs");
app.set("views", templatePath);

// middleware for collecting data from html form
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index.ejs", { shortUrls: shortUrls });
});

app.post("/", async (req, res) => {
  const url = req.body.url;

  const find = await ShortUrl.findOne({ full: url });

  if (!find) {
    const data = new ShortUrl({
      full: url,
      shortUrl: shortid.generate(url),
      clicks: 1,
    });
    await data.save();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const data = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  console.log(data);
  data.clicks++;
  await data.save();

  res.redirect(data.full);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
