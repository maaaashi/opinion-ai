import { Configuration, OpenAIApi } from 'openai'
import supabase from '@libs/supabase';

const hello = async (event) => {
  const config = new Configuration({ apiKey: process.env.OPENAI_APIKEY});
  const openai = new OpenAIApi(config);
  const gr = Math.floor(event.answer_length * 0.8)
  const ls = Math.floor(event.answer_length)
  const request = `
 質問: あなたの職業は${event.occupation}です。${event.title}についての感想文を以下を参考に${gr}文字以上${ls}文字以下の文字数で作成してください。
  ${event.feature}
  回答: `
  const response = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt: request,
      temperature: 1,
      max_tokens: 1000,
    }
  );
  const answer = response.data.choices[0].text!

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