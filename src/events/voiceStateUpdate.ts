import { ArgsOf, Discord, On } from "discordx";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, EmbedBuilder, NewsChannel, TextChannel, VoiceChannel, VoiceState } from "discord.js"
import { GuildController, IGuildResolvable } from "../database/classes/GuildController.js";
import { IVoiceChatResolvable, VcController } from "../database/classes/VcController.js";
import { injectable } from "tsyringe";

@Discord()
@injectable()
export class Event {
    constructor(
        private _guildController: GuildController,
        private _vcController: VcController
    ) {}

    // Mudança do acesso ao canal de texto privado de um usuário
    async setVCTextChannelVisible(state: VoiceState, updateTo: boolean) {
        if (state.channelId) {
            let vcFromChannel: IVoiceChatResolvable = await this._vcController.getVC("vcChannelID", state.channelId);

            if (!vcFromChannel.row) return;
            if (vcFromChannel.row.ownerID == state.member.id) return;

            let textChannel = state.guild.channels.cache.get(vcFromChannel.row.textChannelID) as TextChannel;

            if (textChannel)
                return textChannel.permissionOverwrites.create(state.member.id, {
                    ViewChannel: updateTo
                });
        }
    }

    // Enviar o embed de configurações do canal privado
    // Para o canal de texto especificado
    async sendConfigEmbed(channel: TextChannel) {
        let embed = new EmbedBuilder()
            .setColor("#a245ff")
            .setImage("https://media.tenor.com/AE5cg4I3P6sAAAAC/clouds-purple.gif")
            .setDescription(
"```Welcome to your private channel!```\n" +
`> *In this channel you can share images and messages with your friends, but remember that everything posted here will be **temporary** and is **subject to moderation by the owners or moderators** of the server.*

> ✨ ⠂ *Any suggestions? DM **Zeike Dev#7573**!*
> ❤ ⠂ *Enjoy!*`);

        let firstRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
                .setCustomId("vc_open")
                .setLabel("Open VC")
                .setEmoji("🔓")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("vc_close")
                .setLabel("Close VC")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("vc_password")
                .setLabel("Add Password")
                .setEmoji("🔐")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
        ]);

        let secondRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
                .setCustomId("vc_change_name")
                .setLabel("Change Name")
                .setEmoji("✍").setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("vc_change_limit")
                .setLabel("Change limit")
                .setEmoji("🔧").setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("vc_change_bitrate")
                .setLabel("Change bitrate")
                .setEmoji("🎛").setStyle(ButtonStyle.Primary)
        ])

        channel.send({ embeds: [embed], components: [firstRow, secondRow] }).catch(() => { return; });
    }

    @On({ event: "voiceStateUpdate" })
    async exec([oldState, newState]: ArgsOf<"voiceStateUpdate">) {
        // Informações principais da guilda
        let newGuild = newState.guild;
        let oldGuild = oldState.guild;
        let newGuildRecords: IGuildResolvable = await this._guildController.getGuild(newGuild.id);

        await this.setVCTextChannelVisible(oldState, false);
        await this.setVCTextChannelVisible(newState, true);

        // Criar um novo canal de voz privado
        if (newState.channelId == newGuildRecords.row.vcMakerID) {
            let channelCreator = newGuild.channels.cache.get(newGuildRecords.row.vcMakerID);
            let privateVCCategory = channelCreator.parent as CategoryChannel;

            // Criando um novo canal de voz privado
            if (privateVCCategory) {
                let textChannel = await newGuild.channels.create({
                    name: `pv-${newState.member.displayName}`,
                    permissionOverwrites: [
                        { id: newGuild.id, deny: ["ViewChannel"] }, // Everyone
                        { id: newState.member.id, allow: ["ViewChannel"] } // Owner
                    ],
                    parent: privateVCCategory,
                    type: ChannelType.GuildText
                });

                let vcChannel = await newGuild.channels.create({
                    name: `${newState.member.displayName}'s Private`,
                    parent: privateVCCategory,
                    type: ChannelType.GuildVoice
                });

                // Passar o usuário para o outro canal
                await this.sendConfigEmbed(textChannel);
                newState.member.voice.setChannel(vcChannel, "Private Voice Chat channel creation.");

                // Registrando no banco de dados
                let addResult: IVoiceChatResolvable = await this._vcController.addVC(newGuild.id, vcChannel.id, textChannel.id, newState.member.id);

                if (!addResult.success) {
                    if (textChannel.deletable && vcChannel.deletable) {
                        textChannel.delete().catch(() => { return; });
                        vcChannel.delete().catch(() => { return; });
                        return;
                    }
                }
            }
        }

        // Caso o dono do canal privado sair e for necessário deletar o anterior
        let oldPrivateVC: IVoiceChatResolvable = await this._vcController.getVC("vcChannelID", oldState.channelId);

        if ((newState.mute != oldState.mute || newState.deaf != oldState.deaf) && (newState.channel == oldPrivateVC?.row?.vcChannelID))
            return;

        // Verificando se o canal no qual ele saiu é o que ele haviar criado anteriormente
        if (oldPrivateVC.row && oldState.member.id == oldPrivateVC.row.ownerID) {
            let voiceChannel = oldGuild.channels.cache.get(oldPrivateVC.row.vcChannelID) as VoiceChannel;
            let textChannel = oldGuild.channels.cache.get(oldPrivateVC.row.textChannelID) as TextChannel;

            // Deletando registro e canais
            let removeResult: IVoiceChatResolvable = await this._vcController.removeVC(voiceChannel.id);

            if (!removeResult.success) {
                return console.log(`[DELETE VC ERROR] - ${removeResult.error}`);
            }

            if (voiceChannel && voiceChannel.deletable) voiceChannel.delete().catch(() => { return; });
            if (textChannel && textChannel.deletable) textChannel.delete().catch(() => { return; });
        }
    }
}