<script lang="ts">
  import { focusTrap } from "@skeletonlabs/skeleton";

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
