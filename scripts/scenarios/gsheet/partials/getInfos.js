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
        "/connector/getInfos",
        JSON.stringify({
            gsheetIn: {
                spreadsheet_id: __ENV.CONNECTOR_GSHEET_SPREADSHEET_ID,
                page_name: __ENV.CONNECTOR_GSHEET_PAGE_NAME,
                start_column: __ENV.CONNECTOR_GSHEET_START_COLUMN,
                end_column: __ENV.CONNECTOR_GSHEET_END_COLUMN,
                start_row: __ENV.CONNECTOR_GSHEET_START_ROW,
                end_row: __ENV.CONNECTOR_GSHEET_END_ROW,
            },
            uuid: VU_UUID,
        }),
        {
            tags: { getInfos: "getInfos" },
        }
    );
    const success = check(response, {
        "[gsheet][getInfos] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[gsheet][getInfos] - Fail");
    }
}
