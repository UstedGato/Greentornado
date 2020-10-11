import commando from "discord.js-commando";
class DankArgumentType extends commando.ArgumentType {
    constructor(client) {
        super(client, 'dank');
    }
    validate(val) {
        return val.toLowerCase() === 'dank';
    }
    parse(val) {
        return val;
    }
}
export default DankArgumentType;
