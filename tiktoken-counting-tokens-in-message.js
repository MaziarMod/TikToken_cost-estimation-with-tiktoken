import { get_encoding, encoding_for_model } from 'tiktoken';

const num_tokens_from_messages = (messages, model = 'gpt-3.5-turbo-0301') => {
  // Returns the number of tokens used by a list of messages.
  let tokens_per_message, tokens_per_name;
  let encoding;

  try {
    encoding = encoding_for_model(model);
  } catch (e) {
    console.log('Warning: model not found. Using cl100k_base encoding.');
    encoding = get_encoding('cl100k_base');
  }

  if (
    [
      'gpt-3.5-turbo-0613',
      'gpt-3.5-turbo-16k-0613',
      'gpt-4-0314',
      'gpt-4-32k-0314',
      'gpt-4-0613',
      'gpt-4-32k-0613',
    ].includes(model)
  ) {
    tokens_per_message = 3;
    tokens_per_name = 1;
  } else if (model === 'gpt-3.5-turbo-0301') {
    tokens_per_message = 4; // every message follows <|start|>{role/name}\n{content}<|end|>\n
    tokens_per_name = -1; // if there's a name, the role is omitted
  } else if (model.includes('gpt-3.5-turbo')) {
    console.log(
      'Warning: gpt-3.5-turbo may change over time. Returning num tokens assuming gpt-3.5-turbo-0613.'
    );
    return num_tokens_from_messages(messages, (model = 'gpt-3.5-turbo-0613'));
  } else if (model.includes('gpt-4')) {
    console.log(
      'Warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613'
    );
    return num_tokens_from_messages(messages, (model = 'gpt-4-0613'));
  } else {
    throw new Error(
      `num_tokens_from_messages() is not implemented for model ${model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`
    );
  }

  let num_tokens = 0;
  for (let message of messages) {
    num_tokens += tokens_per_message;
    for (let [key, value] of Object.entries(message)) {
      {
        num_tokens += encoding.encode(value).length;
        if (key === 'name') num_tokens += tokens_per_name;
      }
    }
    num_tokens += 3; // every reply is primed with <|start|>assistant<|message|>
    return num_tokens;
  }
};

const example_messages = [
  {
    role: 'system',
    content:
      'You are a helpful, pattern-following assistant that translates corporate jargon into plain English.',
  },
  {
    role: 'system',
    name: 'example_user',
    content: 'New synergies will help drive top-line growth.',
  },
  {
    role: 'system',
    name: 'example_assistant',
    content: 'Things working well together will increase revenue.',
  },
  {
    role: 'system',
    name: 'example_user',
    content:
      "Let's circle back when we have more bandwidth to touch base on opportunities for increased leverage.",
  },
  {
    role: 'system',
    name: 'example_assistant',
    content: "Let's talk later when we're less busy about how to do better.",
  },
  {
    role: 'user',
    content:
      "This late pivot means we don't have time to boil the ocean for the client deliverable.",
  },
];

console.log(
  'Number of tokens in message: ',
  num_tokens_from_messages(example_messages, 'gpt-3.5-turbo')
);
