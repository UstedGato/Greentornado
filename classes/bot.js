import Eris, { CommandClient } from 'eris';
import { SlashCreator, GatewayServer } from 'slash-create';
import Endpoints from 'eris/lib/rest/Endpoints';
import winston from 'winston';
import { promises as fs } from 'fs';
import { join } from 'path';
import Database from './db';

export default class Bot extends CommandClient {
    constructor (opts) {
        console.log(opts)
        super(opts.token, opts.erisOptions, opts);

        this._slash = new SlashCreator(opts)
        this._slash
        .withServer(
          new GatewayServer(
            (handler) => this.on('rawWS', (event) => {
              if (event.t === 'INTERACTION_CREATE') handler(event.d);
            })
          )
        )

        this._logger = winston.createLogger({
          level: 'debug',
          format: winston.format.simple(),
          transports: [
            new winston.transports.Console()
          ]
        });

        this._db = new Database({ secret: process.env.FAUNA_KEY })

        this.logger.info('Bot class created')

        this.on("ready", async () => {
          this.logger.info('Bot ready, registering slash commands.')
          this._slash.syncCommands();
        });        
    }

    get logger() { return this._logger }
    
    /**
     * @description Registers commands in a directory. Optionally recrusive.
     * @param  {string} dir - The directory to register commands in.
     * @param  {boolean} recrusive - Wether to recruse. Defaults to true.
     */
    async registerCommands(dir, recrusive = true) {
      this.logger.debug(`Loading commands in ${dir}`)
      const files = await fs.readdir(dir)
      files.forEach(async filename => {
        const file = join(dir, filename)
        const stats = await fs.stat(file)
        if (stats.isDirectory()){
          if (recrusive) return await this.registerCommands(file)
          return
        }
        if (!file.endsWith('.js')) return this.logger.debug(`Ignoring ${file}: Not a JavaScript file.`)
        const command = await import(file)
        if (command.default) {
          try {
          const instance = new command.default(() => this)
          this.commands[instance.options.label] = instance
          this._slash.registerCommand(this.commands[instance.options.label]._slash)
          } catch(e) {
            this.logger.error(`Error loading command ${file}, \n\n${e.stack}`)
          }
        } else {
          return this.logger.error(`Invalid command: ${file}, check to make sure that it is correctly exported`)
        }
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