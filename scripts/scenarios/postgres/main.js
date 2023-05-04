import { fail, group } from "k6";
import _bulk from "/k6/scripts/scenarios/postgres/partials/bulk.js";
import _getInfos from "/k6/scripts/scenarios/postgres/partials/getInfos.js";
import _getMetadatas from "/k6/scripts/scenarios/postgres/partials/getMetadatas.js";
import _getSchemas from "/k6/scripts/scenarios/postgres/partials/getSchemas.js";
import _getTables from "/k6/scripts/scenarios/postgres/partials/getTables.js";
import _instanciate from "/k6/scripts/scenarios/postgres/partials/instanciate.js";

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
        _getSchemas();
        _getTables();
        _getInfos();
        _getMetadatas();
    });
    group("bulk", function () {
        _bulk();
    });
}
