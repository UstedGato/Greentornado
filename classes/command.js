import { Command } from 'eris';
import { SlashCommand } from 'slash-create';

export default class BotCommand extends Command {
    constructor (options, getClient) {
        options.argsRequired = !!options.args?.find(arg => arg.required)
        super(options.name, (...props) => this._execute(...props), options)
        this._execute = this._execute.bind(this)
        this.options = options
        this._getClient = getClient
        this._slash = new SlashCommand(getClient()._slash, options)
    }

    get client () { return this._getClient() }

    
    /**
     * @private
     */
    _execute (msg, arrayArgs) {
        console.log(this.run)
        if (typeof this.run !== 'function') return this.run
        if (this.options.isPureCommand) return this.run(msg, arrayArgs)
        const args = {}
        const argDefs = this.options.args
        if (argDefs) {
            arrayArgs.forEach((arg, i) => {
                args[argDefs[i].key] = arg
            })
        }
        console.log(arrayArgs, args)
        return this.run(msg, args)
    }
}