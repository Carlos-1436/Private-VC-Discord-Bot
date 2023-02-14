import { ArgsOf, Discord, On } from "discordx";
import { VcController } from "../database/classes/VcController.js";
import { injectable } from "tsyringe";
import { bot } from "../main.js";
import { vcBtnHandler } from "../utils/interactions/buttons/vcBtnHandler.js";
import { vcModalHandler } from "../utils/interactions/modals/vcModalHandler.js";

@Discord()
@injectable()
export class Event {
    constructor(private _vcController: VcController) {}

    @On({ event: "interactionCreate" })
    async exec([interaction]: ArgsOf<"interactionCreate">) {
        try {
            if (interaction.isCommand()) return await bot.executeInteraction(interaction);
            if (interaction.isButton()) return await vcBtnHandler(interaction, this._vcController);
            if (interaction.isModalSubmit()) return await vcModalHandler(interaction, this._vcController);
        } catch (err) {
            console.log(`[COMMAND EXEC ERROR] - ${err}`);
        }
    }
}