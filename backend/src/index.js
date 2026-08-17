// Start Express Server
import app from "./app.js";
import {PORT} from "./config/env.js";

app.listen(PORT, () => {
    console.log(`CMS admin dashboard: http://localhost:${PORT}\n`);
});