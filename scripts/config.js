import { Httpx } from "https://jslib.k6.io/httpx/0.1.0/index.js";

import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const VU_UUID = uuidv4().replace(/-/g, "");

export const httpx_session = new Httpx({
    baseURL: __ENV.DATASTORE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 20000, // 20s timeout.
});
