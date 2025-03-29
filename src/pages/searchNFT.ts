export default async function handler(req, res) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query" });
  }

  const response = await fetch(
    `https://api.reservoir.tools/search/collections/v1?q=${query}&limit=8`,
    {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
