# Curl examples

Set the host once. These calls are unpaid, so each one should print HTTP 402 and a JSON body that contains `accepts`.

```bash
export BASE=https://tgw-mindset-api.fly.dev
```

## GET /mindset

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' "$BASE/mindset?day=1"
```

$0.02 USDC.

## GET /journal-pack

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' \
  "$BASE/journal-pack?goal=save%20more%20calmly&days=7"
```

$0.05 USDC.

## POST /affirmations

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"goal":"ask for what my work is worth","count":7}' \
  "$BASE/affirmations"
```

$0.03 USDC.

## POST /selftalk

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"text":"I always mess up the ask."}' \
  "$BASE/selftalk"
```

$0.05 USDC.

## POST /coaching

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"text":"I keep waiting to feel ready before I ask for what my work is worth."}' \
  "$BASE/coaching"
```

$0.10 USDC.

## POST /affirmations-audio

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"goal":"ask for what my work is worth"}' \
  "$BASE/affirmations-audio"
```

$0.10 USDC.

## POST /content-pack

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"topic":"building wealth on a small income","platform":"linkedin"}' \
  "$BASE/content-pack"
```

$0.07 USDC.

## POST /search

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"query":"does positive self-talk improve performance","maxResults":5}' \
  "$BASE/search"
```

$0.01 USDC.

## POST /research-pack

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"question":"What do studies say about implementation intentions?"}' \
  "$BASE/research-pack"
```

$0.02 USDC.

## POST /offer-normalize

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"currency":"USD","offers":[{"id":"acme","text":"Setup fee: $100. Then $20 per month."}]}' \
  "$BASE/offer-normalize"
```

$0.01 USDC.

## POST /claim-audit

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"claims":[{"id":"c1","text":"Habits took a median of 66 days to become automatic."}],"sources":[{"id":"s1","excerpt":"Researchers found habits took a median of 66 days to become automatic."}]}' \
  "$BASE/claim-audit"
```

$0.01 USDC.

## POST /invoice-check

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"currency":"USD","text":"Widget $100.00\nSubtotal $100.00\nTax $0.00\nTotal $100.00","total":"100.00"}' \
  "$BASE/invoice-check"
```

$0.01 USDC. `llms.txt` also names optional `convert_to` and `country`. The live OpenAPI schema does not list those properties.

## POST /quote-invoice-check

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"quote":{"line_items":[{"description":"Workshop","quantity":1,"unit_price":"100.00","amount":"100.00"}],"total":"100.00"},"invoice":{"line_items":[{"description":"Workshop","quantity":2,"unit_price":"100.00","amount":"200.00"}],"total":"200.00"}}' \
  "$BASE/quote-invoice-check"
```

$0.01 USDC.

## POST /vendor-check

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"domain":"stripe.com"}' \
  "$BASE/vendor-check"
```

$0.01 USDC. The live OpenAPI schema requires `domain` only. `llms.txt` also describes an optional payee address, which is not in that schema.

## POST /pay-to-check

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"url":"https://example.com/weather","expected_price":"$0.01","network":"eip155:8453"}' \
  "$BASE/pay-to-check"
```

$0.005 USDC.

## POST /email-check

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"email":"ada@example.com"}' \
  "$BASE/email-check"
```

$0.003 USDC.

## POST /fx

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"amount":"100.00","from":"USD","to":"EUR","country":"DE"}' \
  "$BASE/fx"
```

$0.003 USDC.

## POST /company-facts

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"ticker":"AAPL"}' \
  "$BASE/company-facts"
```

$0.005 USDC.

## POST /page-to-markdown

```bash
curl -sS -D - -o /tmp/tgw-body.json -H 'accept: application/json' -H 'content-type: application/json' \
  -d '{"url":"https://example.com/pricing"}' \
  "$BASE/page-to-markdown"
```

$0.003 USDC.

## What to look for

The status line is `HTTP/1.1 402` or `HTTP/2 402`. The body file should contain `"accepts"` and the route's price. Free discovery is not in this list: `GET /openapi.json`, `GET /llms.txt`, `GET /.well-known/x402`, `GET /.well-known/mcp/server-card.json`, and `GET /.well-known/agent-card.json` return 200.
