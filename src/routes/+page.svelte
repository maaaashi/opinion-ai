<script lang="ts">
  import { Input, Button, NumberInput, Label, Textarea, Helper, Spinner, Heading } from 'flowbite-svelte';
  import supabase from '$lib/supabase';
  import { v4 as uuidv4 } from 'uuid';

  let title = ''
  let feature = ''
  let occupation = ''
  let answer_length = 100;
  let answer = ''
  let user_id = uuidv4()

  const search = async () => {
    const url = import.meta.env.VITE_BACKEND_URL
    const body = {
      occupation: occupation,
      title: title,
      feature: feature,
      answer_length: answer_length,
      user_id: user_id
    }
    loading = true
    answer = ''
    await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
  }

  interface Color {
    occupation: "base" | "red" | "green" | undefined;
    title: "base" | "red" | "green" | undefined;
    feature: "base" | "red" | "green" | undefined;
    answer_length: "base" | "red" | "green" | undefined;
  }

  let error_msg = ''

  const setColor = (ans: number): Color => {
    error_msg = ''
    let obj: Color = {
      occupation: 'base',
      title: 'base',
      feature: 'base',
      answer_length: 'base',
    }

    if (ans <= 0 || ans > 1000) {
      error_msg = '生成する文章は、1文字以上1000文字以内に設定してください。'
      obj.answer_length = 'red'
    }

    return obj
  }

  $: color = setColor(answer_length)

  $: disabled = (): boolean => {
    if (loading) return true
    if (error_msg) return true
    if (!title) return true
    if (!occupation) return true
    if (!feature) return true
    return false
  }

  let loading = false;

  const channel = supabase.channel('opinion')

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'opinions',
      filter: `user_id=eq.${user_id}`,
    },
    (payload) => {
      answer = payload.new.answer
      loading = false
    }
  )
  .subscribe()
</script>

<form class="grid grid-cols-2" on:submit|preventDefault={search}>
  <div class="col-span-2 md:col-span-1 mx-1">
    <Label for="title">何について？</Label>
    <Input
      id="title"
      required
      color={color.title}
      placeholder="例) 企業セミナー"
      type="text"
      bind:value={title}
    />
  </div>
  <div class="col-span-2 md:col-span-1 mt-3 md:mt-0 mx-1">
    <Label for="occupation">あなたの職業は？</Label>
    <Input
      id="occupation"
      required
      color={color.occupation}
      placeholder="就活中の大学生"
      type="text"
      bind:value={occupation}
    />
  </div>
  <div class="col-span-2 md:col-span-1 mx-1 mt-3">
    <Label for="answer_length">何文字程度で作りますか？</Label>
    <NumberInput
      id="answer_length"
      required
      color={color.answer_length}
      placeholder="300"
      type="number"
      bind:value={answer_length}
    />

    {#if error_msg}
      <Helper class="mt-2" color="red">{error_msg}</Helper>
    {/if}
  </div>
  <div class="col-span-2 mx-1 mt-3">
    <Label for="feature">どうでした？箇条書きでもOK</Label>
    <Textarea
      id="feature"
      required
      color={color.feature}
      placeholder="例) ・働きやすそうだった。
      ・風通しが良さそうだった。"
      type="text"
      rows="5"
      bind:value={feature}
    />
  </div>

  <div class="col-span-2 my-5 ml-auto mr-0 w-full md:w-fit">
    <Button type="submit" disabled={disabled()}>
      {#if loading}
        <Spinner class="mr-3" size="4" color="white" />作成中 ...
      {:else}
        生成
      {/if}
    </Button>
    {#if loading}
      <Helper class="mt-2" color="red">あまりにも返答がない場合は画面を更新して再度お試しください。</Helper>
    {:else if answer}
      <Helper class="mt-2" color="red">結果は上書きされます。</Helper>
    {/if}
  </div>
</form>

{#if answer}
  <Heading tag="h3">結果</Heading>
  <Textarea type="field" bind:value={answer} rows="5"/>
{/if}