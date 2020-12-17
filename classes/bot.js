import Eris, { CommandClient } from 'eris';
import Endpoints from 'eris/lib/rest/Endpoints';
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
     * @description Registers commands in a directory. Optionally recrusive.
     * @param  {string} dir - The directory to register commands in.
     * @param  {boolean} recrusive - Wether to recruse. Defaults to true.
     */
    async registerCommands(dir, recrusive = true) {
      const commandsPath = join(dir)
      const files = await fs.readdir(commandsPath)
      files.forEach(async file => {
        const stats = await fs.stat(file)
        if (stats.isDirectory()){
          if (recrusive) return await this.registerCommands(file)
          return
        }
        if (!file.endsWith('.js')) return this.logger.debug(`Ignoring ${file}: Not a JavaScript file.`)
        const command = await import(file)
        if (command.default && typeof command.options === 'object') {
          const instance = new command.default(() => this)
          return this.commands[instance.options.label] = instance.label
        }
        return this.logger.error(`Invalid command: ${file}, check to make sure that it is correctly exported`)
        })
    }

    /**
     * @description Fetches a user by ID
     * @see https://gist.github.com/nirewen/507b4ff8ad93d138068a6e514849dda9#file-erisprototypes-js-L79
     * @param  {string} userID - The user's ID
     * @returns {Promise<Eris.User>}
     */
    async fetchUser(userID) {
      const user = await this.requestHandler.request('GET', Endpoints.USER(userID), true);
      return new Eris.User(user, this);
    }
}