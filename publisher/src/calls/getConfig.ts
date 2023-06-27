import fs from "fs/promises";
import path from "path";
import { Authenticated, httpCall, useInjected } from "@httpc/kit";
import { strToU8, zipSync } from "fflate";
import { WorkerConfig, WorkerDefinition } from "./models";


export const getConfig = httpCall(
    // Authenticated("role:system"), // disabled for now :)
    async () => {

        // 1- read all worker definitions
        // 2- create workerd config.capnp file and js
        // 3- zip all and return

        const dataPath = useInjected("ENV:DATA_PATH");
        let capnp = await fs.readFile("config.template.capnp", "utf8");

        const modules = new Map<string, Uint8Array>();
        const config: WorkerConfig = {
            routes: []
        };

        for (const file of await fs.readdir(dataPath)) {
            if (!file.endsWith(".json")) continue;

            const definition: WorkerDefinition = JSON.parse(await fs.readFile(path.join(dataPath, file), "utf8"));

            config.routes.push(definition.name);
            modules.set(`${definition.name}.js`, strToU8(definition.module));


            // generate capnp workerd config
            // 1- append workerd config
            // 2- define service
            // 3- add a binding to the router service
            capnp += `
const ${definition.name} :Workerd.Worker = (
    compatibilityDate = "${definition.compatibilityDate || "2023-02-28"}",
    modules = [(name = "${definition.name}.js", esModule = embed "${definition.name}.js")],
);`;

            const serviceStr = "services = [";
            const serviceIdx = capnp.indexOf(serviceStr);
            capnp = capnp.substring(0, serviceIdx + serviceStr.length) +
                `\n    (name = "${definition.name}", worker = .${definition.name}),` +
                capnp.substring(serviceIdx + serviceStr.length);

            const bindingStr = "bindings = [";
            const bindingIdx = capnp.indexOf(bindingStr);
            capnp = capnp.substring(0, bindingIdx + bindingStr.length) +
                `\n    (name = "${definition.name}", service = "${definition.name}"),` +
                capnp.substring(bindingIdx + bindingStr.length);
        }

        return zipSync({
            ...Object.fromEntries(modules),
            "_meta.json": strToU8(JSON.stringify(config)),
            "config.capnp": strToU8(capnp)
        }, {
            level: 9
        });
    }
);
