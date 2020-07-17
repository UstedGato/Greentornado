async function hook(webhook, embedstosend){
    console.log(webhook)

    await webhook.send('Webhook test', {
        embeds: embedstosend,
    });
    await webhook.delete("AutoHook");
}

exports.sendhook = async function(msg, embedstosend){
    msg.channel.createWebhook('GreenTornado', {
        avatar: 'https://cdn.discordapp.com/avatars/692143848176222360/a94c732b92ef1dcc206216a1d08cae7b.png?size=2048',
    }).then(webhook => hook(webhook, embedstosend));
}