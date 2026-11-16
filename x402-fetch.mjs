/**
 * Pay for one Think and Grow Wealthy route with @x402/fetch.
 *
 *   EVM_PRIVATE_KEY=0x... node x402-fetch.mjs pay-to-check
 *
 * The key is a test wallet. Never use the receiving wallet's key, and never
 * commit it. Run this from the repository root after npm install, or install
 * @x402/fetch, @x402/evm, and viem beside a copy of this file.
 */
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const base = (process.env.TGW_BASE_URL ?? "https://tgw-mindset-api.fly.dev").replace(/\/$/, "");

const routes = {
  mindset: () => paid(`${base}/mindset?day=1`),
  "journal-pack": () => paid(`${base}/journal-pack?goal=save%20more%20calmly&days=7`),
  affirmations: () => paid(`${base}/affirmations`, { goal: "ask for what my work is worth", count: 7 }),
  selftalk: () => paid(`${base}/selftalk`, { text: "I always mess up the ask." }),
  coaching: () => paid(`${base}/coaching`, { text: "I keep waiting to feel ready before I ask for what my work is worth." }),
  "affirmations-audio": () => paid(`${base}/affirmations-audio`, { goal: "ask for what my work is worth" }),
  "content-pack": () => paid(`${base}/content-pack`, { topic: "building wealth on a small income", platform: "linkedin" }),
  search: () => paid(`${base}/search`, { query: "does positive self-talk improve performance", maxResults: 5 }),
  "research-pack": () => paid(`${base}/research-pack`, { question: "What do studies say about implementation intentions?" }),
  "offer-normalize": () => paid(`${base}/offer-normalize`, { currency: "USD", offers: [{ id: "acme", text: "Setup fee: $100. Then $20 per month." }] }),
  "claim-audit": () =>
    paid(`${base}/claim-audit`, {
      claims: [{ id: "c1", text: "Habits took a median of 66 days to become automatic." }],
      sources: [{ id: "s1", excerpt: "Researchers found habits took a median of 66 days to become automatic." }],
    }),
  "invoice-check": () =>
    paid(`${base}/invoice-check`, {
      currency: "USD",
      text: "Widget $100.00\nSubtotal $100.00\nTax $0.00\nTotal $100.00",
      total: "100.00",
    }),
  "quote-invoice-check": () =>
    paid(`${base}/quote-invoice-check`, {
      quote: { line_items: [{ description: "Workshop", quantity: 1, unit_price: "100.00", amount: "100.00" }], total: "100.00" },
      invoice: { line_items: [{ description: "Workshop", quantity: 2, unit_price: "100.00", amount: "200.00" }], total: "200.00" },
    }),
  "vendor-check": () => paid(`${base}/vendor-check`, { domain: "stripe.com" }),
  "pay-to-check": () =>
    paid(`${base}/pay-to-check`, { url: "https://example.com/weather", expected_price: "$0.01", network: "eip155:8453" }),
  "email-check": () => paid(`${base}/email-check`, { email: "ada@example.com" }),
  fx: () => paid(`${base}/fx`, { amount: "100.00", from: "USD", to: "EUR", country: "DE" }),
  "company-facts": () => paid(`${base}/company-facts`, { ticker: "AAPL" }),
  "page-to-markdown": () => paid(`${base}/page-to-markdown`, { url: "https://example.com" }),
};

const name = process.argv[2];
if (!name || !routes[name]) {
  console.error(`Usage: node x402-fetch.mjs <route>\nRoutes: ${Object.keys(routes).join(", ")}`);
  process.exit(1);
}

const privateKey = process.env.EVM_PRIVATE_KEY?.trim();
if (!privateKey) {
  console.error("Set EVM_PRIVATE_KEY to a test wallet. Do not use the receiving wallet.");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const client = new x402Client();
client.register("eip155:*", new ExactEvmScheme(account));
const paidFetch = wrapFetchWithPayment(fetch, client);

const response = await routes[name]();
const body = await response.json();
console.log(response.status);
console.log(JSON.stringify(body, null, 2));
if (response.status !== 200) process.exit(1);

function paid(url, json) {
  return paidFetch(url, json
    ? { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify(json) }
    : { headers: { accept: "application/json" } });
}
