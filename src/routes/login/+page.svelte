<script lang="ts">
  import { focusTrap } from "@skeletonlabs/skeleton";

  let isFocused: boolean = true;
</script>

<h1>Register</h1>

<form use:focusTrap={isFocused} method="POST" action="?/register">
  <label class="label">
    <span>Jméno </span>
    <input
      name="name"
      class="input"
      title="Input (text)"
      type="text"
      placeholder="input text"
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

  <button class="btn variant-filled-primary">Submit</button>
</form>
