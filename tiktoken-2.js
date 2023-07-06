import { encoding_for_model } from 'tiktoken';

const num_tokens_from_string = (string, model_name) => {
  // """Returns the number of tokens in a text string."""
  const encoding = encoding_for_model(model_name);
  return encoding.encode(string).length;
};

const book_text = `
Mrs. Darling quivered and went to the window. It was securely fastened.
She looked out, and the night was peppered with stars. They were
crowding round the house, as if curious to see what was to take place
there, but she did not notice this, nor that one or two of the smaller
ones winked at her. Yet a nameless fear clutched at her heart and made
her cry, “Oh, how I wish that I wasn’t going to a party to-night!”

Even Michael, already half asleep, knew that she was perturbed, and he
asked, “Can anything harm us, mother, after the night-lights are lit?”

“Nothing, precious,” she said; “they are the eyes a mother leaves
behind her to guard her children.”

She went from bed to bed singing enchantments over them, and little
Michael flung his arms round her. “Mother,” he cried, “I’m glad of
you.” They were the last words she was to hear from him for a long
time.
`;

console.log(
  'Number of tokens: ',
  num_tokens_from_string(book_text, 'gpt-3.5-turbo')
);

const price_per_token = 0.002 / 1000;

console.log(
  'price of tokens: $',
  num_tokens_from_string(book_text, 'gpt-3.5-turbo') * price_per_token
);
