import { group } from "k6";
import _bulk from "/k6/scripts/scenarios/gsheet/partials/bulk.js";
import _getSheetsNames from "/k6/scripts/scenarios/gsheet/partials/getSheetsNames.js";
import _getInfos from "/k6/scripts/scenarios/gsheet/partials/getInfos.js";
import _getMetadatas from "/k6/scripts/scenarios/gsheet/partials/getMetadatas.js";
import _instanciate from "/k6/scripts/scenarios/gsheet/partials/instanciate.js";

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
    group("instanciate", function () {
        _instanciate();
    });
    group("infos", function () {
        _getSheetsNames();
        _getInfos();
        _getMetadatas();
    });
    group("bulk", function () {
        _bulk();
    });
}
