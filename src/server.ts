import http from "http";
import config from "config";
import app from "./app";

const port = config.get<number>("port");
const server = http.createServer(app);

server.listen(port, () => console.log(`Server listening at port ${port}`));
