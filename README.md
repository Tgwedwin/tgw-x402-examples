# Think and Grow Wealthy

Public examples for the live [Think and Grow Wealthy](https://tgw-mindset-api.fly.dev) API (`https://tgw-mindset-api.fly.dev`).

The API sells **19 paid routes** to developers and AI agents. Payment is **USDC on Base mainnet** (`eip155:8453`) through **x402 v2** (the `exact` scheme). There is no signup and no API key. An unpaid call returns **HTTP 402**. The `PAYMENT-REQUIRED` header is the x402 challenge. The JSON body repeats `x402Version`, `accepts`, `resource`, and `extensions`.

Mindset coaching is for reflection. It is not financial, investment, tax, or legal advice.

Prices and request shapes below are from the live `GET /openapi.json` document (API 1.9.0), checked against `GET /llms.txt`, `GET /`, and a free MCP `tools/list`. See [Where the live documents disagree](#where-the-live-documents-disagree).

## Payment

| | |
| --- | --- |
| Network | Base mainnet, `eip155:8453` |
| Asset | USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Scheme | `exact`, `x402Version` **2** |
| Settlement | Coinbase CDP or PayAI. The buyer is charged once. |
| Receiving address | Published on `GET /` and in each 402 `accepts[].payTo`. Read it from the live challenge. |
| Amount units | `accepts[].amount` is atomic USDC (6 decimals). A live 402 confirmed `$0.005` → `"5000"` and `$0.02` → `"20000"`. |

Retry with a `PAYMENT-SIGNATURE` header. HTTP 4xx, and the 5xx cases named on each route, do not settle.

## Agent utility routes

These are the routes an agent uses before it pays someone else, checks a vendor or an invoice, or fetches public data. Offer normalization and claim audit sit with the invoice tools.

| Method | Route | MCP tool | Price | Request |
| --- | --- | --- | --- | --- |
| `POST` | [`/pay-to-check`](curl/README.md#post-pay-to-check) | `pay_to_check` | $0.005 | `url` and/or `address`. Optional `expected_price`, `network`. Returns `safe`, `caution`, or `avoid`. |
| `POST` | [`/vendor-check`](curl/README.md#post-vendor-check) | `vendor_check` | $0.01 | `domain` (required). RDAP, DNS, SPF, DKIM, DMARC, and TLS. Not a KYB guarantee. |
| `POST` | [`/invoice-check`](curl/README.md#post-invoice-check) | `invoice_check` | $0.01 | Supplied `text` and/or `line_items`. Optional `currency`, `subtotal`, `tax`, `tax_rate`, `total`, `mode` (`supplied_document`). No URL is fetched. |
| `POST` | [`/quote-invoice-check`](curl/README.md#post-quote-invoice-check) | `quote_invoice_check` | $0.01 | `quote` and `invoice` objects (required). Optional `currency`, `mode` (`supplied_documents`). |
| `POST` | [`/offer-normalize`](curl/README.md#post-offer-normalize) | `offer_normalize` | $0.01 | `offers` (required, 1 to 3 items, each needs `text`). Optional `currency`, `horizon_months` (1–36), `usage`, `fx`. No URL is fetched. |
| `POST` | [`/claim-audit`](curl/README.md#post-claim-audit) | `claim_audit` | $0.01 | `claims` and `sources` (required, up to 10). A claim needs `text`. A source needs `excerpt`. Optional `required_freshness_days`, `as_of`, `mode` (`supplied_excerpt`). |
| `POST` | [`/email-check`](curl/README.md#post-email-check) | `email_check` | $0.003 | `email` (required). Syntax, MX, a disposable-domain list, SPF, and DMARC. No mail is sent. |
| `POST` | [`/fx`](curl/README.md#post-fx) | `fx` | $0.003 | `amount`, `from`, and `to` (required). Optional `vat_rate`, `country`, `vat_included`. Cached ECB reference rates. Not a tax filing. |
| `POST` | [`/company-facts`](curl/README.md#post-company-facts) | `company_facts` | $0.005 | `ticker` or `cik`. Latest annual SEC EDGAR facts. Not investment advice. |
| `POST` | [`/page-to-markdown`](curl/README.md#post-page-to-markdown) | `page_to_markdown` | $0.003 | `url` (required). One public `http` or `https` URL. Private addresses are refused. The download is size-capped. |
| `POST` | [`/search`](curl/README.md#post-search) | `search` | $0.01 | `query` (required, max 300). Optional `maxResults` (1–10, default 5), `focus` (`general` or `self-development`), `task` (`cited-summary` or `sources-only`). Snippets, not fetched pages. Not charged if search fails. |
| `POST` | [`/research-pack`](curl/README.md#post-research-pack) | `research_pack` | $0.02 | `question` (required, max 500). Optional `query` (alias), `focus`, and `options.max_searches` (1–3) / `options.max_sources` (1–8). Up to 3 searches and 8 snippet sources. Claims are not verified. |

`line_items` on an invoice accept `id`, `description`, `quantity`, `unit_price`, `amount`, and `currency`. Unknown amounts are not treated as zero.

## Mindset and self-talk

Journal prompts, affirmations, coaching, and social copy from the 90-day library. Themes, when a route accepts one, are `money`, `discipline`, `gratitude`, `confidence`, `habits`, `identity`, `focus`, `patience`, `courage`, and `generosity`.

| Method | Route | MCP tool | Price | Request |
| --- | --- | --- | --- | --- |
| `GET` | [`/mindset`](curl/README.md#get-mindset) | `daily_mindset` | $0.02 | Optional query `day` (1–90) or `theme`. `day` wins when both are sent. |
| `GET` | [`/journal-pack`](curl/README.md#get-journal-pack) | `journal_pack` | $0.05 | Optional query `goal` and `days` (3–14, default 7). |
| `POST` | [`/affirmations`](curl/README.md#post-affirmations) | `affirmations` | $0.03 | `goal` (required). Optional `count` (5–10, default 7). |
| `POST` | [`/selftalk`](curl/README.md#post-selftalk) | `selftalk` | $0.05 | `text` (required). Recognize, redirect, rehearse, reinforce, embody. |
| `POST` | [`/coaching`](curl/README.md#post-coaching) | `coaching` | $0.10 | `text` (required). |
| `POST` | [`/affirmations-audio`](curl/README.md#post-affirmations-audio) | `affirmations_audio` | $0.10 | `goal` (required). Optional `name`, `voice`, and `inline` (default true). Voices: `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`, `sage`, `shimmer`, `verse`. Default `onyx`. Returns a script, a base64 MP3, and a link that lasts about an hour. Not charged if speech fails. |
| `POST` | [`/content-pack`](curl/README.md#post-content-pack) | `content_pack` | $0.07 | `topic` (required). Optional `audience` and `platform` (`x`, `instagram`, `linkedin`, `facebook`, `threads`, `tiktok`; default `x`). |

## Quick start

### Curl, unpaid

These calls do not pay. Each one should print HTTP 402 and a body that contains `accepts`.

```bash
export BASE=https://tgw-mindset-api.fly.dev

curl -sS -D - -o /tmp/tgw-body.json \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com/weather","expected_price":"$0.01","network":"eip155:8453"}' \
  "$BASE/pay-to-check"
```

Look for `HTTP/2 402`, a `payment-required` header, and `"x402Version": 2` in `/tmp/tgw-body.json`. Every paid route has a matching unpaid example in [curl/README.md](curl/README.md).

### Node, with x402-fetch

[`x402-fetch.mjs`](x402-fetch.mjs) pays for one route with `@x402/fetch` and `@x402/evm`, then prints the status and JSON body. Use a **test wallet**. Do not use the receiving wallet, and do not commit the key. The script reads `EVM_PRIVATE_KEY` from the environment. It does not load a `.env` file by itself. [`.env.example`](.env.example) only names the variable.

```bash
npm install
EVM_PRIVATE_KEY=0x... node x402-fetch.mjs pay-to-check
```

Omit the key and the script exits before it sends a request. `TGW_BASE_URL` overrides the default host (`https://tgw-mindset-api.fly.dev`).

Route names: `pay-to-check`, `vendor-check`, `invoice-check`, `quote-invoice-check`, `offer-normalize`, `claim-audit`, `email-check`, `fx`, `company-facts`, `page-to-markdown`, `search`, `research-pack`, `mindset`, `journal-pack`, `affirmations`, `selftalk`, `coaching`, `affirmations-audio`, `content-pack`.

## MCP

Remote MCP endpoint (Streamable HTTP, described as stateless in the OpenAPI document):

`https://tgw-mindset-api.fly.dev/mcp`

MCP Registry name, from the server card:

`io.github.Tgwedwin/tgw-mindset-api`

`initialize` and `tools/list` are free. A checked `initialize` returned server `think-and-grow-wealthy` version `1.2.0` on protocol `2025-06-18`. `tools/list` returned the 19 tools named in the tables above. A `tools/call` pays that tool's route price. The OpenAPI document says the x402 challenge comes back **inside the tool result**, not as an HTTP 402.

## Free discovery

These return HTTP 200 and do not ask for payment:

- [GET /](https://tgw-mindset-api.fly.dev/) — service card, prices, and receiving address
- [GET /health](https://tgw-mindset-api.fly.dev/health)
- [GET /openapi.json](https://tgw-mindset-api.fly.dev/openapi.json)
- [GET /llms.txt](https://tgw-mindset-api.fly.dev/llms.txt)
- [GET /.well-known/x402](https://tgw-mindset-api.fly.dev/.well-known/x402) — x402scan resource list
- [GET /.well-known/mcp/server-card.json](https://tgw-mindset-api.fly.dev/.well-known/mcp/server-card.json)
- [GET /.well-known/agent-card.json](https://tgw-mindset-api.fly.dev/.well-known/agent-card.json) — A2A card. Skills are these paid routes. Payment is still x402, not an A2A task payload.

`GET /favicon.ico` and `GET /icon.png` are also free.

## Where the live documents disagree

Dollar prices match across OpenAPI `x-402.price`, `llms.txt`, `GET /`, the MCP tool descriptions, and the two unpaid 402 responses checked (`/pay-to-check` at $0.005 and `/mindset` at $0.02). The request shapes do not match everywhere.

`llms.txt` and `GET /` name fields that the OpenAPI schema and the MCP input schema both omit:

- `/research-pack`: prose says optional `options.fetch_page` and `options.ticker` reuse page-to-markdown and company facts. OpenAPI `options` only allows `max_searches` and `max_sources`, and its description says evidence is snippets, not fetched pages. The MCP tool only accepts `question` and `focus`.
- `/invoice-check`: prose says optional `convert_to` and `country`. Neither property is in the OpenAPI schema or the MCP tool (`text`, `currency`, `line_items`, `total` only on MCP).
- `/vendor-check`: prose says an optional payee address is screened against the OFAC SDN list. The OpenAPI description mentions that screen, but the schema and the MCP tool only accept `domain`.

MCP `tools/list` is also narrower than OpenAPI on a few optional fields: `offer_normalize` has no `horizon_months`, `usage`, or `fx`; `invoice_check` has no `subtotal`, `tax`, `tax_rate`, or `mode`; `affirmations_audio` has no `inline`; `research_pack` has no `query` alias and no `options`. HTTP examples in this repo follow the OpenAPI schema. MCP callers should follow `tools/list`.

`GET /.well-known/x402` has `"version": 1`. That field is the resource-list document. Payment challenges use `"x402Version": 2`.

## Layout

| File | Purpose |
| --- | --- |
| `curl/README.md` | Unpaid curl for every paid route |
| `x402-fetch.mjs` | One paid call with `@x402/fetch` |
| `.env.example` | `EVM_PRIVATE_KEY=` left blank |
| `package.json` | Pinned `@x402/fetch`, `@x402/evm`, and `viem` |

This repository holds no wallet key and no facilitator secret.
