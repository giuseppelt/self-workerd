import fs from "fs/promises";
import path from "path";
import { httpCall, useInjected, useLogger, Authenticated, Validate } from "@httpc/kit";
import { WorkerDefinition, WorkerDefinitionSchema } from "./models";


export const publish = httpCall(
    // Authenticated("role:user"), // disabled for now :)
    Validate(WorkerDefinitionSchema),
    async (definition: WorkerDefinition) => {

        // steps
        // 1- write the definition
        // 2- restart all running workers

        const logger = useLogger();

        const dataPath = useInjected("ENV:DATA_PATH");
        await fs.mkdir(dataPath, { recursive: true });
        await fs.writeFile(path.join(dataPath, definition.name + ".json"), JSON.stringify(definition), "utf-8");

        logger.info("Published worker %s", definition.name);

        // run restart in the bg
        // we don't need to wait to be completed
        Promise.resolve().then(async () => {
            const workerApp = useInjected("ENV:FLY_WORKER_APP");
            logger.verbose("Restarting app %s", workerApp);

            const machines = await flyApi(`/v1/apps/${workerApp}/machines`);

            for (const machine of machines) {
                // skip non started machine
                if (machine.state !== "started") continue;

                logger.verbose("Machine %s: restarting", machine.id);

                await flyApi(`/v1/apps/${workerApp}/machines/${machine.id}/stop`, null);
                await new Promise(r => setTimeout(r, 2000));
                await flyApi(`/v1/apps/${workerApp}/machines/${machine.id}/start`, null);

                logger.verbose("Machine %s: restarted", machine.id);
            }
        }).catch(err => {
            logger.error(err);
        });

        return { success: true };
    }
);


async function flyApi(path: string, data?: any) {
    const endpoint = "http://_api.internal:4280";
    const flyToken = useInjected("ENV:FLY_AUTH_TOKEN");

    const response = await fetch(`${endpoint}${path}`, {
        method: arguments.length === 1 ? "GET" : "POST",
        headers: {
            authorization: `Bearer ${flyToken}`,
            ...data !== undefined ? { "content-type": "application/json" } : undefined,
        },
        body: data !== undefined && data !== null ? JSON.stringify(data) : undefined
    });

    return await response.json();
}
