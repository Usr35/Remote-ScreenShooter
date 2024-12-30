const screenshot = require('screenshot-desktop')
const { Client, Events, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require('fs');
const config = require('./config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,    // Permite que el bot envie mensajes
        GatewayIntentBits.MessageContent    // Permite que el bot lea mensajes
    ],
})

client.on(Events.ClientReady, async (client) => {
    console.log(`Conectado como ${client.user.username}`)
})

client.on(Events.MessageCreate, async(message) => {
    if (message.author.bot) { return; }    // Si el autor del mensaje es un bot, no hace nada
    if (!message.content.startsWith(config.prefix)) { return; }   // Si el mesnaje no empieza con el prefijo configurado, no hace nada

    const args = message.content.slice(1).trim().split(/ +/);   // Argumentos del comando
    const command = args.shift().toLowerCase();    // Primera palabra del mensaje (ej.: !screenshot)

    if (command == 'screenshot') {
        try {
            // Capturar la pantalla
            await screenshot({ filename: config.path });

            // Crear el archivo adjunto
            const attachment = new AttachmentBuilder(config.path);

            // Crear un embed opcional
            const embed = new EmbedBuilder()
                .setTitle('Screen Shooter')
                .setDescription(':white_check_mark: Screenshot tomada con exito:')
                .setColor('#90EE90')
                .setAuthor({ name: 'Screen Shooter', iconURL: 'https://media.discordapp.net/attachments/768329192131526686/1323064241866936331/imagine.png?ex=67732718&is=6771d598&hm=73920224b24d637a4ccf97ff8c13214457cc7641c826425f022cbad413783816&=&format=webp&quality=lossless&width=411&height=411', url: 'https://github.com/Usr35/Remote-ScreenShooter' })
                .setImage('attachment://screenshot.jpg')
                .setFooter({ text: 'By U5rB4n35', iconURL: 'https://images-ext-1.discordapp.net/external/LTujLM0EpfWjd3Q4YuCn7MZmD-tjStEilG8tKfKzJ-U/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1213996333623545886/8f7097571a35219c6f7192ea927bb540.png?format=webp&quality=lossless&width=143&height=143' })

            // Enviar el mensaje con la captura de pantalla
            await message.reply({ embeds: [embed], files: [attachment] });

            // Eliminar la captura local después de enviarla
            fs.unlinkSync(config.path);
        } catch (error) {
            console.error('Error al capturar la pantalla:', error);
            message.reply(':x: Ocurrió un error al intentar capturar la pantalla.');
        }
    }
})

// Conectar bot
client.login(config.token)