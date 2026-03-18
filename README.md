# RANKIGI Governance Skill for OpenClaw

Governance infrastructure for OpenClaw agents. Every tool call is SHA-256 hashed, cryptographically chained, logged to RANKIGI's immutable audit trail, and verified against tampering in real time.

## Install

```bash
cp -r rankigi-governance ~/.openclaw/skills/
```

## Configure

```bash
export RANKIGI_API_KEY=rnk_xxxxxxxxx
export RANKIGI_AGENT_ID=my-agent-name
export RANKIGI_INTENT_CHAIN=true
```

Get a free API key at [rankigi.com/signup](https://rankigi.com/signup) — no credit card required.

## What gets governed

- Every tool call your agent makes
- Every tool result returned
- Every agent output generated
- Every error encountered
- Optional: encrypted reasoning records (Intent Chain)

## Intent Chain

Enable `RANKIGI_INTENT_CHAIN=true` to capture encrypted reasoning records. Your agent's chain of thought is hashed and chained alongside actions — cryptographic proof of *why* your agent acted, not just *what* it did.

## Dashboard

View your agent's full audit trail at [rankigi.com/dashboard](https://rankigi.com/dashboard).

## Verify

```bash
curl https://api.rankigi.com/v1/agents/YOUR_AGENT_ID/verify
```

## Docs

Full documentation at [rankigi.com/docs/openclaw](https://rankigi.com/docs/openclaw).

## License

MIT
