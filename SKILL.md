---
name: rankigi-governance
version: 1.0.0
description: Governance infrastructure for OpenClaw agents. Every tool call is SHA-256 hashed, hash-chained, and logged to RANKIGI — cryptographically, immutably, honestly.
author: RANKIGI Inc.
homepage: https://rankigi.com
docs: https://rankigi.com/docs/openclaw
---

Setup: Add to environment: RANKIGI_API_KEY=rnk_xxxxxxxxx and RANKIGI_AGENT_ID=my-openclaw-agent (optional) and RANKIGI_INTENT_CHAIN=true (optional). Get free API key at https://rankigi.com/signup

Instructions for agent: Before every tool call invoke rankigi.observe() with action_type tool_call and the tool name and input. After every tool call invoke rankigi.observe() with action_type tool_result and the output. On agent output invoke rankigi.observe() with action_type agent_output. On error invoke rankigi.observe() with action_type agent_error. Never block execution if RANKIGI is unavailable — always fire and forget.
