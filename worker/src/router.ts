

type RouterConfig = {
    routes: string[]
}

type Env = {
    // own binding
    _config: RouterConfig
} & {
    // the actual workers
    [key: string]: Fetcher
}

export default {
    fetch(request, env) {
        const config = env._config;

        // extract the function path  /$function-name/...splat
        // function name is case insensitive
        const [, route] = new URL(request.url).pathname.toLowerCase().split("/");

        // function not specified or not found
        if (!route || !config.routes.includes(route)) {
            return new Response(null, { status: 404 });
        }

        // worker not loaded
        // something wrong internally
        const worker = env[route];
        if (!worker || typeof worker.fetch !== "function") {
            return new Response(null, { status: 500 });
        }

        // forward the request to the worker
        return worker.fetch(request);
    }
} satisfies ExportedHandler<Env>
