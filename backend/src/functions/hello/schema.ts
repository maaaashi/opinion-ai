export default {
  type: "object",
  properties: {
    user_id: { type: 'string' },
    title: { type: 'string' },
    feature: { type: 'string' },
    occupation: { type: 'string' },
    answer_length: { type: 'number' }
  },
  required: ['user_id', 'title', 'feature', 'occupation', 'answer_length']
} as const;
