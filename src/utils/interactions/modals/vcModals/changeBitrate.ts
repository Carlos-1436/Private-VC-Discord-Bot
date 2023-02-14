import { ModalSubmitInteraction, VoiceChannel } from "discord.js";

export async function changeBitrate(interaction: ModalSubmitInteraction, vcChannel: VoiceChannel) {
    let bitrate = parseInt(interaction.fields.getTextInputValue("change_bitrate_input"));

    if (isNaN(bitrate))
        return interaction.reply({
            content: "Invalid bitrate value!",
            ephemeral: true
        });

    let maxBitrate = interaction.guild.maximumBitrate / 1000;

    if (bitrate > maxBitrate|| bitrate < 8)
        return interaction.reply({
            content: `*You can only put bitrates between **8kbps** and **${maxBitrate}kbps**.*`,
            ephemeral: true
        });

    vcChannel.edit({
        bitrate: bitrate * 1000
    }).then(() => {
        interaction.reply({
            content: `Voice Channel bitrate set to **${bitrate}kbps**!`,
            ephemeral: true
        });
    }).catch(() =>
        interaction.reply({
            content: "*Couldn't set voice channel bitrate, verify my permissions on the server and try again.*",
            ephemeral: true
        })
    )

}