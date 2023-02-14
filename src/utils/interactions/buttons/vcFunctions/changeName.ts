import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export async function changeNameModal(interaction: ButtonInteraction) {
    let nameModal = new ModalBuilder()
        .setCustomId("vc_modal_change_name")
        .setTitle("Change voice chat name")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("change_name_input")
                    .setLabel("Voice channel new name")
                    .setMinLength(1)
                    .setMaxLength(20)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("New name")
            )
        );

    interaction.showModal(nameModal);
}