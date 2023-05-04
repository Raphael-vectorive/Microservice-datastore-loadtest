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
            uuid: VU_UUID,
        }),
        {
            tags: { getInfos: "getInfos" },
        }
    );
    const success = check(response, {
        "[csv][getInfos] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[csv][getInfos] - Fail");
    }
}
