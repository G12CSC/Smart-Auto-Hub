import {checkDBConnection} from "../scripts/test-db.js";
import {describe} from "node:test";

describe("Testing database Connectivity", () => {
    it("should connect to the database successfully", async () => {
        await expect(checkDBConnection()).resolves.toBe(true);
    });

    //add more its if you want to test the connection under this describe block
});