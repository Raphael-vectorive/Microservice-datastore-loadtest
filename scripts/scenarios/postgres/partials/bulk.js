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
            mappingIn: {
                mapping: {
                    uuid: "uuid",
                    label: "character varying",
                    nom_comm: "character varying",
                    insee_com: "character varying",
                    nom_dept: "character varying",
                    department_uuid: "uuid",
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
        "[postgres][bulk] - Status is 200": r => r.status === 200,
    });
    if (!success) {
        fail("[postgres][bulk] - Fail");
    }
}
