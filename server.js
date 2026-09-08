import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import dns from "dns"

dns.setServers(["1.1.1.1", "8.8.8.8"])

const PORT = 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer()
