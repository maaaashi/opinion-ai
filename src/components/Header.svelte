<script lang="ts">
  import { Navbar, NavBrand } from 'flowbite-svelte';
  import rep from '$lib/rep.jpg'
</script>

<div class="border-b-2">
  <Navbar>
    <NavBrand href="/">
      <img
        src={rep}
        class="mr-3 h-6 sm:h-9"
        alt="Flowbite Logo"
      />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        感想文ジェネレーター
      </span>
    </NavBrand>
  </Navbar>
</div>