import fauna from 'faunadb';
const { Client, query: q } = fauna; // Faunadb is a CommonJS module, so we have to import it like this.

export default class Database extends Client {
    constructor (props) {
        super(props)
    }

    get q () { return this.query }
    get query () { return q }
}