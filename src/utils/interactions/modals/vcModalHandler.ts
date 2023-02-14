import { ModalSubmitInteraction, VoiceChannel } from "discord.js";
import { IVoiceChatResolvable, VcController } from "../../../database/classes/VcController.js";
import { changeName } from "./vcModals/changeName.js";
import { changeLimit } from "./vcModals/changeLimit.js";
import { changeBitrate } from "./vcModals/changeBitrate.js";

export async function vcModalHandler(interaction: ModalSubmitInteraction, vcController: VcController) {
    let vcGetResult: IVoiceChatResolvable = await vcController.getVC("textChannelID", interaction.channelId);

    if (!vcGetResult.success)
        return interaction.reply({
            ephemeral: true,
            content: "*An internal error occurred, please try again later.*"
        });


    let vcChannel = interaction.guild.channels.cache.get(vcGetResult.row.vcChannelID) as VoiceChannel;
    if (!vcChannel) return;

    switch (interaction.customId) {
        case "vc_modal_change_name":
            changeName(interaction, vcChannel);
            break;

        case "vc_modal_change_limit":
            changeLimit(interaction, vcChannel);
            break;

        case "vc_modal_change_bitrate":
            changeBitrate(interaction, vcChannel);
            break;
    }
}