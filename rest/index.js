import { readdirSync } from "fs";
import { join } from "path";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (app, client) => {
    ({ readdirSync }.readdirSync({ join }.join(__dirname, 'endpoints')).forEach((file) => {
    }));
};
