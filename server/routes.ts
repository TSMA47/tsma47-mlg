import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Invalid message format" });
      }

      // Trump-style responses
      const responses = [
        "Believe me, folks, that's a great question!",
        "Nobody knows more about this than me, trust me.",
        "We're going to make America great again!",
        "This is tremendous, absolutely tremendous.",
        "Let me tell you something, it's going to be huge!",
        "You know it, I know it, everybody knows it.",
        "We have the best people working on this, the absolute best.",
        "This is going to be spectacular, you've never seen anything like it."
      ];

      // Get a random response but make it seem more natural with a slight delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = responses[Math.floor(Math.random() * responses.length)];

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}