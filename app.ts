import { startInterval } from "./src/listeners/InvervalManager";
import startServer, { callback as serverCallback } from "./src/listeners/socketsManager";
import { callback as gameCallback } from "./src/routes/routes";

const PORT = 4000;
startServer(PORT);
startInterval( 250, [serverCallback, gameCallback] );
