import { Client, query as q } from 'faunadb';

export default class Database extends Client {
    constructor (props) {
        super(props)
    }

    get q () { return this.query }
    get query () { return q }
}