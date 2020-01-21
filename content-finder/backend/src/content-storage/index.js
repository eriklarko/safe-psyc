// @flow

import sqlite3 from 'sqlite3';
const sqlite3Verbose = require('sqlite3').verbose();

class SqliteContentStorage {

    sqliteConnectionString: ?string;
    db: *;

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
            `CREATE TABLE IF NOT EXISTS content (
                name   TEXT NOT NULL,
                data   BLOB NOT NULL,
                source TEXT NOT NULL,
                PRIMARY KEY (name, source)
            )`,
            `CREATE TABLE IF NOT EXISTS metadata (
                metadataName TEXT NOT NULL,
                contentName  TEXT NOT NULL,
                metadata     TEXT NOT NULL,
                PRIMARY KEY (metadataName, contentName)
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

    saveNewContent(name: string, content: *, source: string): Promise<void> {
        console.log('saving', name, source);
        return this._exec(
            `INSERT INTO content (name, data, source) VALUES (?, ?, ?)`, [
                name,
                content,
                source,
            ],
        );
    }

    saveMetadata(metadataName: string, contentName: string, metadata: Object): Promise<void> {
        return this._exec(
            `INSERT INTO metadata (metadataName, contentName, metadata)
                  VALUES (?, ?, ?`, [
                       metadataName,
                       contentName,
                       JSON.stringify(metadata),
                  ],
        );
    }

    getMetadata(metadataName: string, contentName: string): Promise<string> {
        return new Promise((res, rej) => {
            this._dbOrThrow().get(
                `SELECT metadata 
                   FROM metadata
                  WHERE metadataName = ?
                    AND contentName = ?`, 
                [
                    metadataName,
                    contentName,
                ], (err, row) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(row.metadata);
                    }
                });
        });
    }

    getContentWithoutSpecificMetadata(metadataName: string): Promise<Array<*>> {
        return new Promise((res, rej) => {
            this._dbOrThrow().get(
               `SELECT c.data 
                  FROM content c
                  JOIN metadata m
                    ON c.name = m.contentName
                 WHERE m.contentName is NULL
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

export const contentStorage = new SqliteContentStorage(
    //':memory:'
    './db.sqlite'
);
