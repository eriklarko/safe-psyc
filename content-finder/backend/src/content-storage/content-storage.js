// @flow

import sqlite3 from 'sqlite3';
const sqlite3Verbose = require('sqlite3').verbose();

class SqliteImageStorage {

    sqliteConnectionString = null;
    db = null;

    constructor(sqliteConnectionString: string) {
        this.sqliteConnectionString = sqliteConnectionString;
    }

    // this probably needs to be awaited before any other operations are attempted
    connect(): Promise<void> {
        return new Promise((res, rej) => {
            this.db = new sqlite3Verbose.Database(
                this.sqliteConnectionString,
                sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
                err => {
                    if (err) {
                        rej(err);
                    } else {
                        this._createTables()
                            .then( () => res() )
                            .catch( e => rej(e) );
                    }
                },
            )
        });
    }

    _createTables(): Promise<void> {
        const tables = [
            `CREATE TABLE IF NOT EXISTS images (
                id INT UNSIGNED NOT NULL PRIMARY KEY,
                name TEXT NOT NULL,
                data BLOB NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS metadata (
                metadataName TEXT NOT NULL PRIMARY KEY,
                imageName TEXT NOT NULL PRIMARY KEY,
                metadata TEXT NOT NULL COMMENT "probably json, up to the metadata provider"
            )`,
        ];

        // $FlowFixMe: barlg
        return Promise.all(tables.map(table => this._exec(table)));
    }

    _exec(query: string, params?: Array<*>): Promise<void> {
        return new Promise((res, rej) => {
            this._dbOrThrow().serialize( () => {
                this._dbOrThrow().run(query, params, err => {
                    if (err) {
                        rej(err);
                    } else {
                        res();
                    }
                });
            });
        });
    }

    _dbOrThrow(): * {
        if (this.db) {
            return this.db;
        } 

        throw new Error("not connected to the db yet");
    }

    saveNewImage(name: string, image: *): Promise<void> {
        return this._exec(
            `INSERT INTO images (name, data) VALUES (?, ?)`, [
                name,
                image,
            ],
        );
    }

    saveMetadata(metadataName: string, imageName: string, metadata: Object): Promise<void> {
        return this._exec(
            `INSERT INTO metadata (metadataName, imageName, metadata)
                  VALUES (?, ?, ?`, [
                       metadataName,
                       imageName,
                       JSON.stringify(metadata),
                  ],
        );
    }

    getMetadata(metadataName: string, imageName: string): Promise<string> {
        return new Promise((res, rej) => {
            this._dbOrThrow().get(
                `SELECT metadata 
                   FROM metadata
                  WHERE metadataName = ?
                    AND imageName = ?`, 
                [
                    metadataName,
                    imageName,
                ], (err, row) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(row.metadata);
                    }
                });
        });
    }

    getImageWithoutSpecificMetadata(metadatName: string): Promise<Array<byte>> {
        return new Promise((res, rej) => {
            this._dbOrThrow().get(
               `SELECT i.data 
                  FROM images i
                  JOIN metadata m
                    ON i.name = m.imageName
                 WHERE m.imageName is NULL
                   AND m.metadataName = ?`, 
                [
                    metadataName,
                ],
                (err, row) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(row.data);
                    }
                });
        });
    }
}

export const imageStorage = new SqliteImageStorage(':memory:');
