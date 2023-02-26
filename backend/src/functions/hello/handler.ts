import { Configuration, OpenAIApi } from 'openai'
import supabase from '@libs/supabase';

const hello = async (event) => {
  const config = new Configuration({ apiKey: process.env.OPENAI_APIKEY});
  const openai = new OpenAIApi(config);
  const request = `
  質問: あなたの職業は${event.occupation}です。${event.title}についての感想を以下を参考に${event.answer_length}文字程度で作成してください。
  ${event.feature}
  回答: 
  `
  const response = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt: request,
      temperature: 1,
      max_tokens: 1000,
    }
  );
  const answer = response.data.choices[0].text!

  console.log(event.user_id)

  await supabase
    .from('opinions')
    .insert({
      user_id: event.user_id,
      title: event.title,
      feature: event.feature,
      answer_length: event.answer_length,
      answer: answer
    })

    return {
    message: answer
  };
};

export const main = hello;