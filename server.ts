import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/oracle", async (req, res) => {
    const { query, games } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if no API key
      const randomGame = games[Math.floor(Math.random() * games.length)];
      return res.json({
        title: randomGame.title,
        reason: "The Oracle is currently disconnected from the higher plane, but suggests this path based on intuition alone."
      });
    }

    try {
      const { GoogleGenerativeAI } = await import("@google/genai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        You are the Vortex Oracle, a curator who knows every game deeply. 
        Respond in an atmospheric, honest, and slightly mysterious voice. Never sound like a bot. 
        The current date is ${new Date().toDateString()}.

        The user feels: "${query}"

        Here is the curated list of games in the archive:
        ${JSON.stringify(games.map(g => ({ title: g.title, vibes: g.vibes, story: g.story })))}

        Pick exactly one game from this list that best matches the user's feeling. 
        Return your response ONLY as a JSON object with this structure:
        { "title": "Game Title", "reason": "2-3 sentences explaining why in the Oracle's voice" }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      // Extract JSON in case model adds markers
      const jsonMatch = responseText.match(/\{.*\}/s);
      if (jsonMatch) {
         res.json(JSON.parse(jsonMatch[0]));
      } else {
         throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Oracle Error:", error);
      res.status(500).json({ title: "Outer Wilds", reason: "Something went wrong in the loop. The Oracle remains silent, yet the stars still point towards discovery." });
    }
  });

  app.get("/api/games", (req, res) => {
    // We'll serve the games list from here later if needed
    res.json({ message: "Games API active" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VortexGrid Server running at http://localhost:${PORT}`);
  });
}

startServer();
