import { ButtonInteraction, VoiceChannel } from "discord.js";

export async function canConnect(interaction: ButtonInteraction, vcChannel: VoiceChannel, connect: boolean) {
    let everyonePermission = { id: interaction.guildId };
    (connect) ?
        everyonePermission["allow"] = ["Connect"] :
        everyonePermission["deny"] = ["Connect"];

    vcChannel.edit({
        permissionOverwrites: [everyonePermission]
    }).catch(() => interaction.reply({
        ephemeral: true,
        content: "*Couldn't set voice channel configs, verify my permissions on the server and try again.*"
    }));

    interaction.reply({
        content: `*Channel successfully ${(connect) ? "opened" : "closed"}!*`,
        ephemeral: true
    });
}