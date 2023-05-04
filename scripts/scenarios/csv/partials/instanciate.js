import { check, fail } from "k6";
import { httpx_session, VU_UUID } from "/k6/scripts/config.js";
import { parsed_csv } from "/k6/scripts/parser.js";

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
    const response = httpx_session.post(
        "/connector/instanciate/csv",
        JSON.stringify({
            fileIn: {
                content: parsed_csv,
                name: "k6_test_csv",
                size: 100,
                max_rows: 1000,
            },
            userUuid: {
                uuid: VU_UUID,
            },
        })
    );
    const success = check(response, {
        "[csv][instanciate] - status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[csv][instanciate] - Fail");
    }
    return success;
}
