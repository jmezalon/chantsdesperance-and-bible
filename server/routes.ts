import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bible API proxy to Bolls.life
  app.get("/api/bible/:version/:book/:chapter", async (req, res) => {
    const { version, book, chapter } = req.params;
    
    try {
      const response = await fetch(
        `https://bolls.life/get-text/${version}/${book}/${chapter}/`
      );
      
      if (!response.ok) {
        throw new Error(`Bible API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Bible API error:", error);
      res.status(500).json({ error: "Failed to fetch Bible text" });
    }
  });

  // Search Bible API
  app.get("/api/bible/search/:version", async (req, res) => {
    const { version } = req.params;
    const { query, page = "1", limit = "50" } = req.query;
    
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }
    
    try {
      const response = await fetch(
        `https://bolls.life/v2/find/${version}?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Bible search API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Bible search API error:", error);
      res.status(500).json({ error: "Failed to search Bible" });
    }
  });

  // Get available Bible translations
  app.get("/api/bible/translations", async (req, res) => {
    try {
      const response = await fetch(
        "https://bolls.life/static/bolls/app/views/languages.json"
      );
      
      if (!response.ok) {
        throw new Error(`Translations API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Translations API error:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
