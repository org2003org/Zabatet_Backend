import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

function configureDns() {
    const rawServers = process.env.DNS_SERVERS;
    if (!rawServers) {
        return;
    }

    const servers = rawServers
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (servers.length === 0) {
        return;
    }

    dns.setServers(servers);
}

export async function connectDB() {
    try {
        configureDns();
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}