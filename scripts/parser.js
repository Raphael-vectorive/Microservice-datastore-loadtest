import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { SharedArray } from "k6/data";

export const parsed_csv = new SharedArray("parsed csv", function () {
    return papaparse.parse(open(__ENV.CONNECTOR_CSV_FILE), {
        // download: true,
        // worker: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    }).data;
});
