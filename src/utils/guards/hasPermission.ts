import { CommandInteraction } from "discord.js";
import { GuardFunction } from "discordx";

export function hasPermission(permission: bigint) {
    const guard: GuardFunction<CommandInteraction> = async(
        interaction, client, next
    ) => {
        if (!interaction.memberPermissions.has(permission))
            return interaction.reply({
                content: "You don't have permission to use this command!",
                ephemeral: true
            });
        next();
    }

    return guard;
}