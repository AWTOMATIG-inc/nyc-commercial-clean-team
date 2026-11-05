// The system prompt tells the model to stay on topic, but nothing enforces it.
// A cleaning-company assistant has no reason to send a code block, so one means
// the model was pushed off topic.
const CODE_BLOCK_PATTERN = /```|~~~/;

const OFF_TOPIC_REPLY =
  "I can only help with questions about our commercial cleaning services, coverage areas, quotes, and booking. What can I help you with?";

export function guardReply(reply) {
  return CODE_BLOCK_PATTERN.test(reply) ? OFF_TOPIC_REPLY : reply;
}
