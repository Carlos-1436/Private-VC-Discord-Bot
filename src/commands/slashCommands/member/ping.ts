import { EmbedBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, Discord, Slash } from "discordx";

@Discord()
export class Command {
    @Slash({ name: "ping", description: "I will calculate my response time in milliseconds!" })
    async exec(interaction: CommandInteraction, client: Client) {
        let embed = new EmbedBuilder()
            .setTitle(`✨ ⠂ Response Time`)
            .setColor([255, 219, 61])
            .setDescription(`🛰 **API:** *${client.ws.ping}ms*\n**📡 My Response Time:** *Calculating...*`);

        // Send Ping message and calculate response time
        let pingMsg = await interaction.channel.send({ embeds: [embed] });
        let ping = (pingMsg.createdTimestamp - interaction.createdTimestamp);
        embed.setDescription(`🛰 **API:** *${client.ws.ping}ms*\n**📡 My Response Time:** *${ping}ms*`);

        if (pingMsg.editable) pingMsg.edit({ embeds: [embed] });

        await interaction.reply({ content: "*Successfully calculated response time!*" });
    }
}