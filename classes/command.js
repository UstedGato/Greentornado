import { Command } from 'eris';

export default class BotCommand extends Command {
    constructor (options, client) {
        options.argsRequired = !!options.args?.find(arg => arg.required)
        super(options.label, (...props) => this._execute(...props), options)
        this._execute = this._execute.bind(this)
        this.options = options
        this._client = client
    }

    get client () { return this._client }

    
    /**
     * @private
     */
    _execute (msg, arrayArgs) {
        console.log(this.run)
        if (typeof this.run !== 'function') return this.run
        const args = {}
        const argDefs = this.options?.args
        if (argDefs) {
            arrayArgs.forEach((arg, i) => {
                args[argDefs[i].key] = arg
            })
        }
        console.log(arrayArgs, args)
        return this.run(msg, args)
    }
}