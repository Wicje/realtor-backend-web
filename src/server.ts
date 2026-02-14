import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import "./socket";
import cors from "cors";
import morgan from "morgan";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});



httpServer.listen(5000, () => {
  console.log("Server running on port 5000");
});
