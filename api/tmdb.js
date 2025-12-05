export default async function handler(req, res) {
  try {
    const TMDB_BASE = "https://api.themoviedb.org/3";

    const { path, query } = req.query;
    const url = `${TMDB_BASE}/${path}?${query}`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "TMDB Proxy Error", details: String(err) });
  }
}
