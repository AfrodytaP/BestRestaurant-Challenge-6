import dotenv from "dotenv";
import Config from "./config/Config.js";
import Database from "./db/Database.js";
import Server from "./server/Server.js";
import AuthRoutes from "./routes/auth.routes.js";

dotenv.config();

Config.load();

const { PORT, HOST } = process.env;

if (!PORT || !HOST) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const database = new Database();
const authRoutes = new AuthRoutes();

const routers = [{ path: "/auth", router: authRoutes.getRouter() }];

const server = new Server(PORT, HOST, routers);

(async () => {
  try {
    console.log("Connecting to the database...");
    await database.connect();
    console.log("Database connection successful");

    console.log("Starting the server...");
    await server.start();
    console.log(`Server is running at http://${HOST}:${PORT}`);
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
})();
