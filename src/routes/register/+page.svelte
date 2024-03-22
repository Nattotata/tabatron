<script lang="ts">
  import { focusTrap } from "@skeletonlabs/skeleton";
  import type { PageData, ActionData } from "./$types";

  export let data: PageData;

  export let form: ActionData;

  import { onMount } from "svelte";
  onMount(() => {
    if (form?.status === 201) {
      localStorage.setItem("JWT", form.token);
      localStorage.setItem("myCat", "Tom");
    }

    console.info(form?.parsedToken);
    console.log("the component has mounted");
  });
  let isFocused: boolean = true;
</script>

<h2>Log in</h2>
<form use:focusTrap={isFocused} method="POST" action="?/login">
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

  <button class="btn variant-filled-primary">Log in</button>
</form>
<hr />

<h1>Register</h1>

<form use:focusTrap={isFocused} method="POST" action="?/register">
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

  <button class="btn variant-filled-primary">Registrovat</button>
</form>

{#if form?.status === 201}
  <p>
    {form.token}
    Ahoj {form?.parsedToken?.email}
  </p>
{/if}
Ahoj {data.name}
