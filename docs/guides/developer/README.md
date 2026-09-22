# Developer guides

For the developer maintaining the Knowledge Islands website: how it deploys, how its generated routes are declared, and how its published guidance stays honest about where it came from and reachable once it is there.

## Deployment

- [Cloudflare](cloudflare.md) — the dashboard-owned half of the deployment: Workers Builds settings, domains, and the commands an operator must not run locally.

## Declared routes

- [Tool routes](tool-routes.md) — how each released tool gets its page and installation endpoint, and what a tool repository hands over when it releases.
- [Projects directory](projects-directory.md) — how every public ecosystem repository earns a card and a page, and why the directory makes no release promises.

## Published guidance

- [Deciding what this site publishes](guidance-ownership.md) — whether a piece of public explanation belongs here or in the repository that holds it, and what the site owes a source it restates.
- [Guidance provenance](guidance-provenance.md) — the `sources` declaration every guidance page carries, and how a refresh sweep finds pages whose upstream has moved.
- [Guidance reachability](guidance-reachability.md) — how the build proves every published guidance page can be reached by navigating, and which link to add when one cannot.
