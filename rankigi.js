const crypto = require('crypto');

const RANKIGI_API_URL = 'https://api.rankigi.com/v1/events';
const MAX_BUFFER = 100;

class RankigiGovernance {
  constructor() {
    this.apiKey = process.env.RANKIGI_API_KEY;
    this.agentId = process.env.RANKIGI_AGENT_ID || 'openclaw-agent';
    this.intentChain = process.env.RANKIGI_INTENT_CHAIN === 'true';
    this.retryQueue = [];
    this.isRetrying = false;
  }

  canonicalJson(obj) {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) return '[' + obj.map(v => this.canonicalJson(v)).join(',') + ']';
    const keys = Object.keys(obj).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + this.canonicalJson(obj[k])).join(',') + '}';
  }

  hash(payload) {
    return crypto.createHash('sha256').update(this.canonicalJson(payload), 'utf8').digest('hex');
  }

  async observe({ action_type, tool_invoked = null, input = null, output = null, execution_result = 'success', reasoning = null }) {
    if (!this.apiKey) return;
    const event = {
      event_id: crypto.randomUUID(),
      agent_id: this.agentId,
      timestamp: new Date().toISOString(),
      action_type,
      tool_invoked,
      input_hash: this.hash(input || {}),
      output_hash: this.hash(output || {}),
      decision_metadata: { skill: 'rankigi-governance', framework: 'openclaw' },
      execution_result,
      data_quality_flag: 'ok',
    };
    if (this.intentChain && reasoning) {
      event.intent = { reasoning, source: 'chain_of_thought' };
    }
    this._send(event);
  }

  _send(event) {
    fetch(RANKIGI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify(event)
    }).catch(() => {
      if (this.retryQueue.length < MAX_BUFFER) this.retryQueue.push(event);
      this._scheduleRetry();
    });
  }

  _scheduleRetry() {
    if (this.isRetrying || this.retryQueue.length === 0) return;
    this.isRetrying = true;
    setTimeout(() => {
      const batch = this.retryQueue.splice(0, 10);
      batch.forEach(event => this._send(event));
      this.isRetrying = false;
      if (this.retryQueue.length > 0) this._scheduleRetry();
    }, 5000 * Math.min(this.retryQueue.length, 10));
  }

  async toolCall(toolName, input, reasoning = null) {
    await this.observe({ action_type: 'tool_call', tool_invoked: toolName, input, reasoning });
  }

  async toolResult(toolName, output) {
    await this.observe({ action_type: 'tool_result', tool_invoked: toolName, output });
  }

  async agentOutput(output, reasoning = null) {
    await this.observe({ action_type: 'agent_output', output, execution_result: 'success', reasoning });
  }

  async agentError(error) {
    await this.observe({ action_type: 'agent_error', output: { error: error.message }, execution_result: 'error' });
  }
}

module.exports = new RankigiGovernance();
