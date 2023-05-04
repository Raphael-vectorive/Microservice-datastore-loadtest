import http from "k6/http";
import { sleep } from "k6";

export const options = {
    scenarios: {
        my_web_test: {
            // some arbitrary scenario name
            executor: "constant-vus",
            vus: 50,
            duration: "5m",
            gracefulStop: "0s", // do not wait for iterations to finish in the end
            tags: { test_type: "website" }, // extra tags for the metrics generated by this scenario
            exec: "webtest", // the function this scenario will execute
        },
        my_api_test_1: {
            executor: "constant-arrival-rate",
            rate: 90,
            timeUnit: "1m", // 90 iterations per minute, i.e. 1.5 RPS
            duration: "5m",
            preAllocatedVUs: 10, // the size of the VU (i.e. worker) pool for this scenario
            tags: { test_type: "api" }, // different extra metric tags for this scenario
            env: { MY_CROC_ID: "1" }, // and we can specify extra environment variables as well!
            exec: "apitest", // this scenario is executing different code than the one above!
        },
        my_api_test_2: {
            executor: "ramping-arrival-rate",
            startTime: "30s", // the ramping API test starts a little later
            startRate: 50,
            timeUnit: "1s", // we start at 50 iterations per second
            stages: [
                { target: 200, duration: "30s" }, // go from 50 to 200 iters/s in the first 30 seconds
                { target: 200, duration: "3m30s" }, // hold at 200 iters/s for 3.5 minutes
                { target: 0, duration: "30s" }, // ramp down back to 0 iters/s over the last 30 second
            ],
            preAllocatedVUs: 50, // how large the initial pool of VUs would be
            maxVUs: 100, // if the preAllocatedVUs are not enough, we can initialize more
            tags: { test_type: "api" }, // different extra metric tags for this scenario
            env: { MY_CROC_ID: "2" }, // same function, different environment variables
            exec: "apitest", // same function as the scenario above, but with different env vars
        },
    },
    discardResponseBodies: true,
    thresholds: {
        // we can set different thresholds for the different scenarios because
        // of the extra metric tags we set!
        "http_req_duration{test_type:api}": ["p(95)<250", "p(99)<350"],
        "http_req_duration{test_type:website}": ["p(99)<500"],
        // we can reference the scenario names as well
        "http_req_duration{scenario:my_api_test_2}": ["p(99)<300"],
    },
};

console.log(__ENV);

export function webtest() {
    http.get("https://test.k6.io/contacts.php");
    sleep(Math.random() * 2);
}

export function apitest() {
    http.get(`https://test-api.k6.io/public/crocodiles/${__ENV.MY_CROC_ID}/`);
    // no need for sleep() here, the iteration pacing will be controlled by the
    // arrival-rate executors above!
}
