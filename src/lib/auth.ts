/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

let db: any;

try {
  await client.connect();
  db = client.db("pawmed");
  console.log("✅ Connected to MongoDB for Better Auth");
} catch (error) {
  console.error("❌ MongoDB connection error:", error);
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",

  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", default: "client", required: false, input: true },
      phone: { type: "string", required: false, input: true },
      address: { type: "string", required: false, input: true },
      profileImage: { type: "string", required: false, input: true },
      specialization: { type: "string", required: false, input: true },
      licenseNumber: { type: "string", required: false, input: true },
      experience: { type: "number", required: false, input: true },
      hospitalName: { type: "string", required: false, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user: any) => {
          return {
            data: {
              ...user,
              role: user.role || "client",
              phone: user.phone || "",
              address: user.address || "",
              profileImage: user.profileImage || "",
              specialization: user.specialization || "",
              licenseNumber: user.licenseNumber || "",
              experience: user.experience || 0,
              hospitalName: user.hospitalName || "",
            },
          };
        },
      },
    },
  },
});

export default auth;