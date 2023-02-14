import { CommandInteraction, PermissionFlagsBits, VoiceChannel } from "discord.js";
import { Discord, Guard, Slash } from "discordx";
import { hasPermission } from "../../../utils/guards/hasPermission.js";
import { injectable } from "tsyringe";
import { GuildController, IGuildResolvable } from "../../../database/classes/GuildController.js";

@Discord()
@injectable()
export class Command {
    constructor(private _guildController: GuildController) {}

    @Slash({ name: "deletevc", description: "Delete private voice chat configurations." })
    @Guard(hasPermission(PermissionFlagsBits.Administrator))
    async exec(interaction: CommandInteraction) {
        let guildRecords: IGuildResolvable = await this._guildController.getGuild(interaction.guildId);

        if (!guildRecords.success)
            return interaction.reply({
                ephemeral: true,
                content: "*An internal error occurred, please try again later.*"
            });

        if (!guildRecords.row)
            return await interaction.reply({
                content: "No record found in the database for this guild.",
                ephemeral: true
            })

        // Deleting guild channels
        let channel = interaction.guild.channels.cache.get(guildRecords.row.vcMakerID) as VoiceChannel;
        let category = channel?.parent;

        if (channel && channel.deletable) channel.delete();
        if (category && category.deletable) category.delete();

        // Deleting records from database
        let guildDeleteResult: IGuildResolvable = await this._guildController.removeGuild(interaction.guildId);

        await interaction.reply({
            content: (guildDeleteResult.success && guildDeleteResult.changes > 0) ? "Records successfully deleted!" : "No records removed",
            ephemeral: true
        });
    }
}