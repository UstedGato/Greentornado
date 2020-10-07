module.exports = (app, client) => {
    app.get('/api/user/:id', async (req, res) => {
        const data = await client.users.fetch(req.params.id)
        res.json(data)
    })
}