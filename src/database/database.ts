import { singleton } from "tsyringe";
import sqlite from "sqlite3";

@singleton()
export class Database {
    private dbConn: sqlite.Database;

    constructor() {
        this.dbConn = new sqlite.Database("database.sqlite", (err: Error) => {
            if (err)
                return console.log(`[DATABASE ERROR] - Unable to establish a SQLITE3 connection: ${err.message}`);
        });

        this.dbConn.serialize(() => {
            this.dbConn.exec(`CREATE TABLE IF NOT EXISTS "guilds" (
                "guildID"	TEXT NOT NULL,
                "vcMakerID"	TEXT,
                PRIMARY KEY("guildID")
            );`);

            this.dbConn.exec(`CREATE TABLE IF NOT EXISTS "voicechats" (
                "vcChannelID"	TEXT NOT NULL,
                "textChannelID"	TEXT NOT NULL,
                "guildID"	TEXT NOT NULL,
                "ownerID"   TEXT NOT NULL,
                FOREIGN KEY("guildID") REFERENCES "guilds"("guildID") ON DELETE CASCADE,
                PRIMARY KEY("vcChannelID")
            );`);
        })
    }

    public get conn(): sqlite.Database {
        return this.dbConn;
    };
}