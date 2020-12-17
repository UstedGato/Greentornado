import { CommandClient } from 'eris';
import winston from 'winston';
import { promises as fs } from 'fs';
import Database from './db';

export default class Bot extends CommandClient {
    constructor (...opts) {
        super(...opts);

        this._logger = winston.createLogger({
          transports: [
            new winston.transports.Console()
          ]
        });

        this._db = new Database({ secret: process.env.FAUNA_KEY })
    }

    get logger() { return this._logger }


    
    /**
     * @description Recrusively registers commands in a directory
     * @param  {string} dir - The directory to register commands in.
     */
    async registerCommands(dir) {
      const commandsPath = join(dir)
      const files = await fs.readdir(commandsPath)
      files.forEach(async file => {
        const stats = await fs.stat(file)
        if (stats.isDirectory()) return await this.registerCommands(file)
        if (!file.endsWith('.js')) return this.logger.debug(`Ignoring ${file}: Not a JavaScript file.`)
        const command = await import(file)
        if (command.default && typeof command.options === 'object') {
          return this.registerCommand(
            command.options.name,
            command.default,
            command
          )
        }
        return this.logger.error(`Invalid command: ${file}, check to make sure that it is correctly exported`)
        })
    }
}