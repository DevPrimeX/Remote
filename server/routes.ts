import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, hashPassword } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Authentication (Passport session)
  setupAuth(app);

  // === Products API ===
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const products = await storage.getProducts(category, search);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  // === Inquiries API ===
  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);
      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.inquiries.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const inquiries = await storage.getInquiries();
    res.json(inquiries);
  });

  // === Seed Data Endpoint (Optional, or run on startup) ===
  // seeding function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("admin");
  if (!existingUsers) {
    // Default admin user
    // In production, password should be hashed. setupAuth will handle hashing/verification.
    // For simplicity here, we assume setupAuth hashes on create or we store plain for the demo (NOT RECOMMENDED).
    // Let's rely on the auth system to hash.
    await storage.createUser({
      username: "admin",
      password: await hashPassword("password123"),
      isAdmin: true
    });
  }

  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    await storage.createProduct({
      name: "25ml Measuring Cup",
      category: "Measuring Cups",
      description: "High quality PP measuring cup for syrups and liquid medicines.",
      specs: {
        material: "Polypropylene (PP)",
        capacity: "25ml",
        weight: "2.5g",
        shape: "Cylindrical"
      },
      images: ["https://placehold.co/600x400?text=Measuring+Cup"],
      whatsappEnabled: true
    });

    await storage.createProduct({
      name: "Aluminum Blister Foil",
      category: "Foils",
      description: "Pharmaceutical grade aluminum blister foil for tablet packaging.",
      specs: {
        material: "Aluminum",
        supplyAbility: "500 Tons/Month",
        deliveryTime: "7-10 Days"
      },
      images: ["https://placehold.co/600x400?text=Blister+Foil"],
      whatsappEnabled: true
    });
    
    await storage.createProduct({
      name: "Plastic Pharma Tray",
      category: "Trays",
      description: "Durable plastic trays for ampoules and vials.",
      specs: {
        material: "PVC",
        shape: "Rectangular",
        capacity: "10 Ampoules"
      },
      images: ["https://placehold.co/600x400?text=Pharma+Tray"],
      whatsappEnabled: true
    });
  }
}
