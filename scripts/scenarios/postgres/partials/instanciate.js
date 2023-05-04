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
        "/connector/instanciate/postgres",
        JSON.stringify({
            postgresIn: {
                host: __ENV.CONNECTOR_POSTGRES_HOST,
                port: __ENV.CONNECTOR_POSTGRES_PORT,
                username: __ENV.CONNECTOR_POSTGRES_USERNAME,
                password: __ENV.CONNECTOR_POSTGRES_PASSWORD,
                dbName: __ENV.CONNECTOR_POSTGRES_DB_NAME,
                schemaName: __ENV.CONNECTOR_POSTGRES_SCHEMA_NAME,
                tableName: __ENV.CONNECTOR_POSTGRES_TABLE_NAME,
                max_rows: 1000,
            },
            sshIn: null,
            userUuid: {
                uuid: VU_UUID,
            },
        }),

        {
            tags: { instanciate: "instanciate" },
        }
    );

    const success = check(response, {
        "[postgres][instanciate] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[postgres][instanciate] - Fail");
    }
    return success;
}
