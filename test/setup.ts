import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'))
    } catch (err) { }
});

// Instead of removing an entire file from the test, and, in fact, 
// instead of creating an entire db file for testing, 
// I would recommend storing the data in memory. SQLite, specifically, can do such a thing. 
// Just place this in your `.env.test` file:

// DB_NAME=:memory: