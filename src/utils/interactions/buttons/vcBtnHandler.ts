import { ButtonInteraction, VoiceChannel } from "discord.js";
import { IVoiceChatResolvable, VcController } from "../../../database/classes/VcController.js";
import { canConnect } from "./vcFunctions/connect.js";
import { changeNameModal } from "./vcFunctions/changeName.js";
import { changeLimitModal } from "./vcFunctions/changeLimit.js";
import { changeBitrateModal } from "./vcFunctions/changeBitrate.js";

export async function vcBtnHandler(interaction: ButtonInteraction, vcController: VcController) {
    let vcGetResult: IVoiceChatResolvable = await vcController.getVC("textChannelID", interaction.channelId);

    if (!vcGetResult.success)
        return interaction.reply({
            ephemeral: true,
            content: "*An internal error occurred, please try again later.*"
        });

    if (vcGetResult?.row && vcGetResult.row.ownerID != interaction.user.id)
        return interaction.reply({
            content: "*You are not allowed to do this!*",
            ephemeral: true
        });

    let vcChannel = interaction.guild.channels.cache.get(vcGetResult.row.vcChannelID) as VoiceChannel;
    if (!vcChannel) return;

    // Voice Chat embed buttons
    switch (interaction.customId) {
        case "vc_close":
        case "vc_open":
            canConnect(interaction, vcChannel, (interaction.customId.endsWith("open")) ? true : false);
            break;

        case "vc_change_name":
            changeNameModal(interaction);
            break;

        case "vc_change_limit":
            changeLimitModal(interaction);
            break;

        case "vc_change_bitrate":
            changeBitrateModal(interaction);
            break;
    }
}