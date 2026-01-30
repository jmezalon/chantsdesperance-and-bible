import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";
import { db } from "./db";
import { users, hymnSubmissions, insertUserSchema, insertHymnSubmissionSchema } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const TRUSTED_THRESHOLD = 5;

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const user = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
  if (!user[0]?.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "hymns-app-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
        return;
      }

      const { username, password } = parsed.data;
      
      const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existing.length > 0) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await db.insert(users).values({
        username,
        password: hashedPassword,
      }).returning();

      req.session.userId = newUser.id;
      res.json({ 
        id: newUser.id, 
        username: newUser.username, 
        isAdmin: newUser.isAdmin,
        approvedCount: newUser.approvedCount 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      req.session.userId = user.id;
      res.json({ 
        id: user.id, 
        username: user.username, 
        isAdmin: user.isAdmin,
        approvedCount: user.approvedCount 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Logout failed" });
        return;
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      res.json(null);
      return;
    }
    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
    if (!user) {
      res.json(null);
      return;
    }
    res.json({ 
      id: user.id, 
      username: user.username, 
      isAdmin: user.isAdmin,
      approvedCount: user.approvedCount,
      isTrusted: user.approvedCount >= TRUSTED_THRESHOLD
    });
  });

  app.post("/api/submissions", requireAuth, async (req, res) => {
    try {
      const parsed = insertHymnSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
        return;
      }

      const { sectionId, language, hymnNumber } = parsed.data;
      
      const existingSubmission = await db.select().from(hymnSubmissions)
        .where(and(
          eq(hymnSubmissions.sectionId, sectionId),
          eq(hymnSubmissions.language, language),
          eq(hymnSubmissions.hymnNumber, hymnNumber),
          eq(hymnSubmissions.status, "approved")
        ))
        .limit(1);
      
      if (existingSubmission.length > 0) {
        res.status(400).json({ error: "This hymn already exists in the database" });
        return;
      }

      const pendingSubmission = await db.select().from(hymnSubmissions)
        .where(and(
          eq(hymnSubmissions.sectionId, sectionId),
          eq(hymnSubmissions.language, language),
          eq(hymnSubmissions.hymnNumber, hymnNumber),
          eq(hymnSubmissions.status, "pending")
        ))
        .limit(1);
      
      if (pendingSubmission.length > 0) {
        res.status(400).json({ error: "This hymn is already pending review" });
        return;
      }

      const [submitter] = await db.select().from(users).where(eq(users.id, req.session.userId!)).limit(1);
      const isTrusted = submitter.approvedCount >= TRUSTED_THRESHOLD;
      const autoApprove = isTrusted || submitter.isAdmin;

      const [submission] = await db.insert(hymnSubmissions).values({
        ...parsed.data,
        submittedBy: req.session.userId!,
        status: autoApprove ? "approved" : "pending",
        reviewedBy: autoApprove ? req.session.userId! : null,
        reviewedAt: autoApprove ? new Date() : null,
      }).returning();

      if (autoApprove) {
        await db.update(users)
          .set({ approvedCount: submitter.approvedCount + 1 })
          .where(eq(users.id, req.session.userId!));
      }

      res.json({ 
        ...submission, 
        autoApproved: autoApprove,
        message: autoApprove 
          ? "Hymn published! (Trusted contributor)" 
          : "Submission received and pending review"
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Submission failed" });
    }
  });

  app.get("/api/submissions", requireAuth, async (req, res) => {
    try {
      const submissions = await db.select()
        .from(hymnSubmissions)
        .where(eq(hymnSubmissions.submittedBy, req.session.userId!))
        .orderBy(desc(hymnSubmissions.createdAt));
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/pending", requireAdmin, async (req, res) => {
    try {
      const submissions = await db.select({
        submission: hymnSubmissions,
        submitter: {
          id: users.id,
          username: users.username,
          approvedCount: users.approvedCount,
        }
      })
        .from(hymnSubmissions)
        .leftJoin(users, eq(hymnSubmissions.submittedBy, users.id))
        .where(eq(hymnSubmissions.status, "pending"))
        .orderBy(desc(hymnSubmissions.createdAt));
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching pending submissions:", error);
      res.status(500).json({ error: "Failed to fetch pending submissions" });
    }
  });

  app.get("/api/submissions/approved", async (req, res) => {
    try {
      const submissions = await db.select()
        .from(hymnSubmissions)
        .where(eq(hymnSubmissions.status, "approved"))
        .orderBy(desc(hymnSubmissions.reviewedAt));
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching approved submissions:", error);
      res.status(500).json({ error: "Failed to fetch approved hymns" });
    }
  });

  app.post("/api/submissions/:id/review", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { action, note } = req.body;

      if (!["approve", "reject"].includes(action)) {
        res.status(400).json({ error: "Invalid action" });
        return;
      }

      const [submission] = await db.select().from(hymnSubmissions).where(eq(hymnSubmissions.id, id)).limit(1);
      if (!submission) {
        res.status(404).json({ error: "Submission not found" });
        return;
      }

      const [updated] = await db.update(hymnSubmissions)
        .set({
          status: action === "approve" ? "approved" : "rejected",
          reviewedBy: req.session.userId!,
          reviewNote: note || null,
          reviewedAt: new Date(),
        })
        .where(eq(hymnSubmissions.id, id))
        .returning();

      if (action === "approve") {
        await db.update(users)
          .set({ approvedCount: users.approvedCount })
          .where(eq(users.id, submission.submittedBy));
          
        const [submitter] = await db.select().from(users).where(eq(users.id, submission.submittedBy)).limit(1);
        await db.update(users)
          .set({ approvedCount: submitter.approvedCount + 1 })
          .where(eq(users.id, submission.submittedBy));
      }

      res.json(updated);
    } catch (error) {
      console.error("Review error:", error);
      res.status(500).json({ error: "Review failed" });
    }
  });

  app.get("/api/hymns/check-exists", async (req, res) => {
    const { sectionId, language, hymnNumber } = req.query;
    
    if (!sectionId || !language || !hymnNumber) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    }

    try {
      const existing = await db.select().from(hymnSubmissions)
        .where(and(
          eq(hymnSubmissions.sectionId, Number(sectionId)),
          eq(hymnSubmissions.language, String(language)),
          eq(hymnSubmissions.hymnNumber, Number(hymnNumber))
        ))
        .limit(1);
      
      res.json({ 
        exists: existing.length > 0,
        status: existing[0]?.status || null
      });
    } catch (error) {
      console.error("Check exists error:", error);
      res.status(500).json({ error: "Check failed" });
    }
  });
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
