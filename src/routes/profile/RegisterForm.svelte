<script lang="ts">
  import { focusTrap } from "@skeletonlabs/skeleton";

  let isFocused: any = "";
  export let form = "";
</script>

<h2 class="h2">Register</h2>

<form
  use:focusTrap={isFocused}
  method="POST"
  action="?/register"
>
  <label class="label">
    <span>Jméno</span>
    <input
      name="name"
      class="input"
      title="Input (text)"
      type="text"
      placeholder="input text"
    />
  </label>
  <label class="label">
    <span>Email</span>
    <input
      name="email"
      class="input"
      title="Input (email)"
      type="email"
      placeholder="john@example.com"
      autocomplete="email"
    />
  </label>

  <label class="label">
    <span>Heslo</span>
    <input
      name="password"
      class="input"
      title="Input (password)"
      type="password"
      placeholder="password"
    />
  </label>

  <button class="btn mt-2 variant-filled-primary"
    >Registrovat</button
  >
</form>

{#if form?.status === 201}
  TADA
{/if}
