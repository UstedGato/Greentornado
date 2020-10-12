module.exports = (app, client) => {
    app.get('/api/user/:id', async (req, res) => {
        let data;
        try {
        data = await client.users.fetch(req.params.id)
        } catch (e) {
            res.send(e)
            return
        }
        res.json(data)
    })
}