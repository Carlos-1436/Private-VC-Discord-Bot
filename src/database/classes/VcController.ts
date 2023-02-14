import { injectable } from "tsyringe";
import { Database } from "../database.js";

type tableColumns = "ownerID" | "textChannelID" | "vcChannelID";

export interface IVoiceChatResolvable {
    success: boolean | undefined;
    error: string | undefined;
    row?: any;
    changes?: number;
}

@injectable()
export class VcController {
    constructor(private _database: Database) {}

    async addVC(
        guildID: string,
        vcChannelID: string,
        txtChannelID: string,
        ownerID: string
    ): Promise<IVoiceChatResolvable> {
        let result: IVoiceChatResolvable = { success: false, error: undefined };
        let stmt = this._database.conn.prepare(`INSERT INTO voicechats(vcChannelID, textChannelID, guildID, ownerID) VALUES(?,?,?,?)`);

        return new Promise((resolve, reject) => {
            stmt.run([vcChannelID, txtChannelID, guildID, ownerID], (err) => {
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

    async getVC(condition: tableColumns, equalsTo: any): Promise<IVoiceChatResolvable> {
        let result: IVoiceChatResolvable = { success: false, error: undefined, row: undefined };

        return new Promise((resolve, reject) => {
            this._database.conn.get(
                `SELECT * FROM voicechats WHERE ${condition}=?`,
                [equalsTo],
                (err, row) =>
            {
                if (err) {
                    result.error = err.message
                    return reject(result);
                }
                result.success = true;
                result.row = row;
                resolve(result);
            });
        });
    }

    async removeVC(vcChannelID: string): Promise<IVoiceChatResolvable> {
        let result: IVoiceChatResolvable = { success: false, error: undefined, changes: 0 };
        let stmt = this._database.conn.prepare(`DELETE FROM voicechats WHERE vcChannelID=?`);

        return new Promise((resolve, reject) => {
            stmt.run([vcChannelID], function(err) {
                if (err) {
                    result.error = err.message;
                    return reject(result);
                }
                result.changes = this.changes;
                result.success = true;
                resolve(result);
            });

            stmt.finalize((err: Error) => {
                if (err)
                    return console.log(`[QUERY FINALIZE ERROR] - ${err}`);
            });
        });
    }

    async updateVC(ownerID: string, update: tableColumns, updateTo: any): Promise<IVoiceChatResolvable> {
        let result: IVoiceChatResolvable = { success: false, error: undefined, changes: 0 };
        let stmt = this._database.conn.prepare(`UPDATE voicechats SET ${update}=? WHERE ownerID=?`);

        return new Promise((resolve, reject) => {
            stmt.run([updateTo, ownerID], function(err) {
                if (err) {
                    result.error = err.message;
                    return reject(result);
                }
                result.changes = this.changes;
                result.success = true;
                resolve(result);
            });

            stmt.finalize((err: Error) => {
                if (err)
                    return console.log(`[QUERY FINALIZE ERROR] - ${err}`);
            });
        });
    }
}