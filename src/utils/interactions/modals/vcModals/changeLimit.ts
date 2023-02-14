import { ModalSubmitInteraction, VoiceChannel } from "discord.js";

export async function changeLimit(interaction: ModalSubmitInteraction, vcChannel: VoiceChannel) {
    let newLimit = parseInt(interaction.fields.getTextInputValue("change_limit_input"));

    if (isNaN(newLimit) || newLimit < 0 || newLimit > 99)
        return interaction.reply({
            content: "*Invalid user limit value!*",
            ephemeral: true
        });

    vcChannel.setUserLimit(newLimit)
        .then(() => {
            interaction.reply({
                content: "*User limit changed!*",
                ephemeral: true
            });
        })
        .catch(() =>
            interaction.reply({
                content: "*Couldn't set voice channel limit, verify my permissions on the server and try again.*",
                ephemeral: true
            })
        );
}