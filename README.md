# self-workerd

This is a proof-of-concept on how you can build and self-host a complete FaaS architecture.

This project is based on [workerd](https://github.com/cloudflare/workerd), the V8-based JavaScript runtime that powers Cloudflare Workers.

And, for a real scenario, it uses [Fly](https://fly.io) as cloud provider, where the FaaS is hosted. It relies on container-based deployment.

## Step by step Tutorial
A complete guide can be found on
[https://www.breakp.dev/blog/build-your-own-faas](https://www.breakp.dev/blog/build-your-own-faas/?from=github-readme)

It includes everything - from setup, to test and deploy.


## Local run
This is a pnpm managed repository. So, it all starts with
```
pnpm install
```
Then you can start the publisher
```
cd publisher
pnpm dev
```
and the worker
```
cd worker
pnpm build
pnpm start:worker
```


## Follow updates
- Star the repository
- Twitter: [@giuseppelt](https://twitter.com/@giuseppelt)
