// RANKIGI governance with Intent Chain enabled
// Set RANKIGI_INTENT_CHAIN=true in your environment
//
// Reasoning is encrypted client-side before transmission.
// Raw reasoning never leaves the machine unencrypted.
// The ciphertext hash is chained — proving intent existed at that moment.

const rankigi = require('../rankigi');

// Pass reasoning as the third argument to toolCall()
// This captures WHY your agent decided to use this tool
await rankigi.toolCall(
  'query_database',
  { query: 'SELECT balance FROM accounts WHERE id = 42' },
  'User asked about account balance. Querying the accounts table to retrieve current balance for account #42.'
);

// Execute the tool
const rows = [{ balance: 15420.00 }];

// Log the result
await rankigi.toolResult('query_database', { rows, count: rows.length });

// Agent output with reasoning
await rankigi.agentOutput(
  { answer: 'Account #42 has a balance of $15,420.00' },
  'Retrieved balance from database. Formatting as currency for user display.'
);
