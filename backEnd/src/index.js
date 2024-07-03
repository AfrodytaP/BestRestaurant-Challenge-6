import dotenv from "dotenv";
import Config from "./config/Config.js";
import Database from "./db/Database.js";
import Server from "./server/Server.js";
import UserRoutes from "./routes/User.routes.js";
import BookingRoutes from "./routes/booking.routes.js";

const envFile = {
  development: ".env.dev",
  test: ".env.test",
  production: ".env",
}[process.env.NODE_ENV || "development"];

dotenv.config({ path: envFile });

Config.load();

const { PORT, HOST } = process.env;

if (!PORT || !HOST) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const database = new Database();
const authRoutes = new UserRoutes();
const bookingRoutes = new BookingRoutes();

const routers = [
  { path: "/auth", router: authRoutes.getRouter() },
  { path: "/booking", router: bookingRoutes.getRouter() },
];

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
