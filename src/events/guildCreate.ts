import { ArgsOf, Discord, On } from "discordx";
import { injectable } from "tsyringe";
import { GuildController, IGuildResolvable } from "../database/classes/GuildController.js";

@Discord()
@injectable()
export class Command {
    constructor(private _guildController: GuildController) {}

    @On({ event: "guildCreate" })
    async exec([guild]: ArgsOf<"guildCreate">) {
        let addResult: IGuildResolvable = await this._guildController.addGuild(guild.id, null);

        if (!addResult.success)
            return console.log(`[GUILD REGISTER ERROR] - Cannot register guild ${guild.name}(${guild.id})\n - ${addResult.error}`);

        console.log(`[GUILD REGISTERED] - Guild successfully registered! ${guild.name}(${guild.id})`)
    }
}