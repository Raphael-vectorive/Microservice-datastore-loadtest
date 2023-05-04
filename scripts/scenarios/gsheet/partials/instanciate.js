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
        "/connector/instanciate/gsheet",
        JSON.stringify({
            gSheetIn: {
                spreadsheet_id: __ENV.CONNECTOR_GSHEET_SPREADSHEET_ID,
                max_rows: 1000,
            },
            userUuid: {
                uuid: VU_UUID,
            },
        }),
        {
            tags: { instanciate: "instanciate" },
        }
    );
    const success = check(response, {
        "[gsheet][instanciate] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[gsheet][instanciate] - Fail");
    }
}
