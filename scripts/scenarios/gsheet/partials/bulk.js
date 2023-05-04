import { check, fail } from "k6";
import { httpx_session, VU_UUID } from "/k6/scripts/config.js";

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
        "/connector/bulk",
        JSON.stringify({
            mappingIn: {
                mapping: {
                    user_uuid: "str",
                    connected: "bool",
                    connection_time: "str",
                    token: "str",
                    last_connection: "date",
                    first_connection: "datetime",
                    connection_count: "int",
                    latitude: "float",
                    longitude: "float",
                    coordinees: "str",
                },
            },
            geoAxeIn: {},
            uuid: VU_UUID,
        }),
        {
            tags: { bulk: "bulk" },
        }
    );
    const success = check(response, {
        "[gsheet][bulk] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[gsheet][bulk] - Fail");
    }
}
