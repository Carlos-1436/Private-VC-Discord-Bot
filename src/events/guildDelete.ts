import { ArgsOf, Discord, On } from "discordx";
import { injectable } from "tsyringe";
import { GuildController, IGuildResolvable } from "../database/classes/GuildController.js";

@Discord()
@injectable()
export class Command {
    constructor(private _guildController: GuildController) {}

    @On({ event: "guildDelete" })
    async exec([guild]: ArgsOf<"guildDelete">) {
        let deleteResult : IGuildResolvable = await this._guildController.removeGuild(guild.id);

        if (!deleteResult.success)
            return console.log(`[GUILD REMOVE ERROR] - Cannot remove guild ${guild.name}(${guild.id})\n - ${deleteResult.error}`);

        console.log(`[GUILD REMOVED] - ${deleteResult.changes} registers deleted for ${guild.name}(${guild.id}).`)
    }
}