import { Command } from 'eris';
import { SlashCommand } from 'slash-create';

export default class BotCommand extends Command {
    constructor (options, client) {
        options.argsRequired = !!options.args?.find(arg => arg.required)
        super(options.name, (...props) => this._execute(...props), options)
        this._execute = this._execute.bind(this)
        this.options = options
        this.client = client
        if (this.runSlash) {
            const _this = this
            class ExtendedClass extends SlashCommand {
                constructor(client) {
                    super(client, _this.options)
                }
                run (ctx) {
                    return _this._execute(ctx, ctx.options, true)
                }
            }
            this._slash = new ExtendedClass(client._slash, options)
        }
    }

    /**
     * @private
     */
    _execute (msg, rawArgs, isSlash = false) {
        if (isSlash && this.runSlash) return this.runSlash(msg, rawArgs)
        if (typeof this.run !== 'function') return this.run
        if (this.options.isPureCommand) return this.run(msg, rawArgs)
        const args = {}
        const argDefs = this.options.args
        if (argDefs) {
            rawArgs.forEach((arg, i) => {
                args[argDefs[i].key] = arg
            })
        }
        return this.run(msg, args)
    }
}