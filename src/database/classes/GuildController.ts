import { injectable } from "tsyringe";
import { Database } from "../database.js";

export interface IGuildResolvable {
    success: boolean | undefined;
    error: string | undefined;
    changes?: number;
    row?: any;
}

type updateTypes = "vcMakerID";

@injectable()
export class GuildController {
    constructor(private _database: Database) {}

    async addGuild(guildID: string, vcChannelID: string | null): Promise<IGuildResolvable> {
        let result: IGuildResolvable = { success: false, error: undefined };
        let stmt = this._database.conn.prepare(`INSERT INTO guilds(guildID, vcMakerID) VALUES(?, ?)`);

        return new Promise((resolve, reject) => {
            stmt.run([guildID, vcChannelID], (err) => {
                if (err) {
                    result.error = err.message;
                    return reject(result);
                }

                result.success = true;
                resolve(result);
            });

            stmt.finalize((err: Error) => {
                if (err)
                    return console.log(`[QUERY FINALIZE ERROR] - ${err}`);
            });
        });
    }

    async getGuild(guildID: string): Promise<IGuildResolvable> {
        let result: IGuildResolvable = { success: false, error: undefined, row: undefined }

        return new Promise((resolve, reject) => {
            this._database.conn.get(
                `SELECT * FROM guilds WHERE guildID=?`,
                [guildID],
                (err, row) =>
            {
                if (err) {
                    result.error = err.message;
                    return reject(result);
                }

                result.row = row;
                result.success = true;
                resolve(result);
            });
        });
    }

    async removeGuild(guildID: string): Promise<IGuildResolvable> {
        let result: IGuildResolvable = { success: false, error: undefined, changes: 0 };
        let stmt = this._database.conn.prepare(`DELETE FROM guilds WHERE guildID=?`);

        return new Promise((resolve, reject) => {
            stmt.run([guildID], function(err) {
                if (err) {
                    result.error = err.message;
                    return reject(result);
                }

                result.success = true;
                result.changes = this.changes;
                resolve(result);
            });

            stmt.finalize((err: Error) => {
                if (err)
                    return console.log(`[QUERY FINALIZE ERROR] - ${err}`);
            });
        });
    }

    async updateGuild(guildID: string, update: updateTypes, updateTo: string): Promise<IGuildResolvable> {
        let result: IGuildResolvable = { success: false, changes: 0, error: undefined };
        let stmt = this._database.conn.prepare(`UPDATE guilds SET ${update}=? WHERE guildID=?`);

        return new Promise((resolve, reject) => {
            stmt.run([updateTo, guildID], function(err) {
                if (err) {
                    result.error = err.message;
                    reject(result);
                }
                result.success = true;
                result.changes = this.changes;
                resolve(result);
            });

            stmt.finalize((err: Error) => {
                if (err)
                    return console.log(`[QUERY FINALIZE ERROR] - ${err}`);
            });
        });
    }
}