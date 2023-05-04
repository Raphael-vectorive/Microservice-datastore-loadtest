import { sleep, group } from "k6";
import _csv from "/k6/scripts/scenarios/csv/main.js";
import _postgres from "/k6/scripts/scenarios/postgres/main.js";
import _gsheet from "/k6/scripts/scenarios/gsheet/main.js";

export let options = {
    scenarios: {
        main: {
            executor: "constant-vus",
            vus: 10,
            duration: "30s",
        },
    },
};

export default function () {
    group("csv", function () {
        _csv();
    });
    group("posgres", function () {
        _postgres();
    });
    group("gsheet", function () {
        _gsheet();
    });
}
