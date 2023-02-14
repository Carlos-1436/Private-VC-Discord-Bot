import { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export async function changeBitrateModal(interaction: ButtonInteraction) {
    let modal = new ModalBuilder()
        .setCustomId("vc_modal_change_bitrate")
        .setTitle("Change voice chat bitrate")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("change_bitrate_input")
                    .setLabel("Voice chat new bitrate")
                    .setPlaceholder(`Min/Max: 8kbps/${interaction.guild.maximumBitrate/1000}kbps`)
                    .setMinLength(1)
                    .setMaxLength(3)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
            )
        );

    interaction.showModal(modal);
}