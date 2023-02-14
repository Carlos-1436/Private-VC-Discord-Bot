import { ModalSubmitInteraction, VoiceChannel } from "discord.js";

export async function changeName(interaction: ModalSubmitInteraction, vcChannel: VoiceChannel) {
    let newName = interaction.fields.getTextInputValue("change_name_input");
    vcChannel.setName(newName)
        .then(() => {
            interaction.reply({
                content: "*Channel name updated to* `" + newName + "`",
                ephemeral: true
            });
        })
        .catch(() =>
            interaction.reply({
                content: "*Couldn't set voice channel name, verify my permissions on the server and try again.*",
                ephemeral: true
            })
        );
}