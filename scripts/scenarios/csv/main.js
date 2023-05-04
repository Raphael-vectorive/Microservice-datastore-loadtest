import { group, fail } from "k6";
import _bulk from "/k6/scripts/scenarios/csv/partials/bulk.js";
import _getInfos from "/k6/scripts/scenarios/csv/partials/getInfos.js";
import _getMetadatas from "/k6/scripts/scenarios/csv/partials/getMetadatas.js";
import _instanciate from "/k6/scripts/scenarios/csv/partials/instanciate.js";

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
        if (!_instanciate()) {
            fail("Fail to instanciate");
        }
    });
    group("infos", function () {
        _getInfos();
        _getMetadatas();
    });
    group("bulk", function () {
        _bulk();
    });
}
