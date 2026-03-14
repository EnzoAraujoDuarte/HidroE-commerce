# HYDROGEN

Premium fashion storefront built with Next.js App Router, GSAP, Lenis and a Shopify-compatible Storefront API.

## Local setup

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. If you do not provide Shopify credentials, the app falls back to `https://mock.shop/api`
4. Start the project with `npm run dev`

## Environment variables

- `SHOPIFY_STOREFRONT_ENDPOINT`: optional custom Storefront GraphQL endpoint
- `SHOPIFY_STOREFRONT_TOKEN`: optional Storefront access token
- `COMMERCE_FETCH_TIMEOUT_MS`: optional fetch timeout in milliseconds
- `COMMERCE_FETCH_RETRIES`: optional number of retries for transient network failures

## Vercel deployment

1. Push the repository to GitHub, GitLab or Bitbucket
2. Import the project in Vercel as a Next.js application
3. Add the environment variables from `.env.example` in the Vercel project settings
4. Keep the build command as `npm run build`
5. Deploy

The storefront is configured to:

- fall back to Mock.shop when Shopify credentials are not set
- retry transient commerce fetch failures
- render graceful unavailable states instead of crashing key routes when the commerce backend is temporarily unreachable
