
export default class BotCommand extends Command {
    constructor (options, client) {
        options.argsRequired = !!options.args?.find(arg => arg.required)
        super(options.label, (...props) => this.execute(...props), options)
        this.execute = this.execute.bind(this)
        this._client = props.client
    }

    get client () { return this._client }

    execute (msg, arrayArgs) {
        if (typeof this.run !== 'function') return this.run
        const args = {}
        const argDefs = this.options?.args
        if (argDefs) {
            arrayArgs.forEach((arg, i) => {
                args[argDefs[i].key] = arg
            })
        }
        this.run(msg, args)
    }
}