
var statuses = [
    { activity: { name: 'the beans' , type: "WATCHING"}, status: 'dnd' },
    { activity: { name: 'kirby with a gun', type: "PLAYING"}, status: 'dnd' },
    { activity: { name: 'shrek 2', type: "STREAMING"}, status: 'dnd' },
    { activity: { name: 'megalovania', type: "LISTENING"}, status: 'dnd' }
]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
var last =  getRandomInt(3);
async function rotate(client) {
    var random = getRandomInt(3)
    while (last === random){
        random = getRandomInt(3)
    }
    last = random
    client.user.setPresence(statuses[random]);
}
exports.startRotation = async function (client) {
    setInterval(rotate, 30000, client);
    rotate(client)
    console.log("Started status rotator")
}