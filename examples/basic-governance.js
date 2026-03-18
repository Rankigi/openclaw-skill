// Basic RANKIGI governance for OpenClaw
// Every tool call is SHA-256 hashed and cryptographically chained.

const rankigi = require('../rankigi');

// Before a tool call — log the action and input
await rankigi.toolCall('read_file', { path: '/etc/config.json' });

// Execute the tool (your agent does this)
const result = fs.readFileSync('/etc/config.json', 'utf8');

// After the tool call — log the result
await rankigi.toolResult('read_file', { content: result, bytes: result.length });

// When your agent produces final output
await rankigi.agentOutput({ summary: 'Config file read successfully', fields: 12 });

// If something goes wrong
try {
  throw new Error('Permission denied');
} catch (err) {
  await rankigi.agentError(err);
}
