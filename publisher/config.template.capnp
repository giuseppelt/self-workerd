using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "router", worker = .router),
  ],

  sockets = [ ( name = "http", address = "*:8080", http = (), service = "router" ) ],
);

const router :Workerd.Worker = (
  compatibilityDate = "2023-02-28",
  modules = [(name = "router.js", esModule = embed "_router.js")],
  bindings = [
    (name = "_config", json = embed "_meta.json"),
  ],
);
