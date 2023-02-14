import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Client, Discord, Guard, Slash } from "discordx";
import { hasPermission } from "../../../utils/guards/hasPermission.js";
import { PermissionFlagsBits, ChannelType } from "discord.js";
import { container, injectable } from "tsyringe";
import { GuildController, IGuildResolvable } from "../../../database/classes/GuildController.js";

@Discord()
@injectable()
export class Command {
    constructor(private _guildController: GuildController) {}

    @Slash({ name: "setvc", description: "Set private voice chat in your server!" })
    @Guard(hasPermission(PermissionFlagsBits.Administrator))
    async exec(interaction: CommandInteraction, client: Client) {
        let botMember = interaction.guild.members.cache.get(client.user.id);

        if (botMember && !botMember.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: "*I need `Manage Channels` permission to create new channels and setup Voice Chat on your server.*"
            });

        // Process embed
        let resultEmbed = new EmbedBuilder()
            .setTitle(`⚙ Configurating...`)
            .setColor([255, 0, 0])
            .setDescription(`❌ - *Created VC channels*\n❌ - *Registered Guild on database*`);
        let embedMsg = await interaction.channel.send({
            embeds: [resultEmbed]
        });

        // Creating new voice chat category and channel
        let category = await interaction.guild.channels.create({
            name: "Private VC",
            type: ChannelType.GuildCategory
        });

        let voiceChannel = await interaction.guild.channels.create({
            name: "Connect to create VC",
            type: ChannelType.GuildVoice,
            parent: category
        });

        resultEmbed.setDescription(`✅ - *Created private VC channels*\n❌ - *Registered Guild on database*`);
        embedMsg.edit({ embeds: [resultEmbed] }).catch(() => { return; });

        let getResult: IGuildResolvable = await this._guildController.getGuild(interaction.guildId);

        // Register channel and guild on database
        if (getResult.success && !getResult.row) {
            let addResult: IGuildResolvable = await this._guildController.addGuild(interaction.guildId, voiceChannel.id);

            if (!addResult.success)
                return interaction.reply({
                    content: `*An unexpected internal error occurred while registering your guild, please try again later.*`
                });

            resultEmbed.setTitle(`⚙ All done!`);
            resultEmbed.setDescription(`✅ - *Created private VC channels*\n✅ - *Registered Guild on database*`);
            resultEmbed.setColor([0, 255, 0]);
            embedMsg.edit({ embeds: [resultEmbed] }).catch(() => { return; });

            return await interaction.reply({
                content: "*Setup completed successfully!*",
                ephemeral: true
            });
        }

        // Update Private VC creator channel ID on database
        let updateResult: IGuildResolvable = await this._guildController.updateGuild(interaction.guildId, "vcMakerID", `${voiceChannel.id}`);

        if (!updateResult.success)
            return interaction.reply({
                content: `*An unexpected internal error occurred while registering your guild, please try again later.*\n ${updateResult.error}`
            });

        resultEmbed.setTitle(`⚙ All done!`);
        resultEmbed.setDescription(`✅ - *Created private VC channels*\n✅ - *Registered Guild on database*`);
        resultEmbed.setColor([0, 255, 0]);
        embedMsg.edit({ embeds: [resultEmbed] }).catch(() => { return; });

        await interaction.reply({
            content: "Setup completed successfully!",
            ephemeral: true
        });
    }
}