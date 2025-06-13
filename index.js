import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// Correct OMDB API URL
const API_URL = "http://www.omdbapi.com/";


const apiKey = process.env.OMDB_API_KEY;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { data: null, error: null });
});

app.post("/submit", async (req, res) => {
  const title = req.body.title;
  const year = req.body.year;

  try {
    // Debugging log
    console.log("Requesting:", `${API_URL}?apikey=${apiKey}&t=${title}${year}`);

    const response = await axios.get(`${API_URL}?apikey=${apiKey}&t=${title}${year}`);

    // Debugging API response
    console.log("API Response:", response.data);

    // Handle "Movie Not Found" response
    if (response.data.Response === "False") {
      return res.render("index.ejs", { data: null, error: "❌ Movie not found. Try another title." });
    }

    res.render("index.ejs", { data: response.data, error: null });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).render("index.ejs", { data: null, error: "⚠️ API request failed. Check your network or API key." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});