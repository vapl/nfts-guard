import axios from "axios";
import "dotenv/config";

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
const BASE_URL = "https://api.reservoir.tools";

if (!RESERVOIR_API_KEY) {
  throw new Error("RESERVOIR_API_KEY is undefined!");
}

// Create Reservoir API client
const reservoirClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": RESERVOIR_API_KEY,
    "Content-Type": "application/json",
  },
});

export default reservoirClient;
