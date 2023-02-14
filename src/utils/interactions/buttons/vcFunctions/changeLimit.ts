import { ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, ButtonInteraction } from "discord.js";

export async function changeLimitModal(interaction: ButtonInteraction) {
    let limitModal = new ModalBuilder()
        .setCustomId("vc_modal_change_limit")
        .setTitle("Change voice chat limit")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("change_limit_input")
                    .setLabel("Voice channel new limit")
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Insert a number (0-99). 0 -> unlimited")
            )
        )
    interaction.showModal(limitModal);
}