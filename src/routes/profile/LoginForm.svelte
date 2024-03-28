<script lang="ts">
  import { focusTrap } from "@skeletonlabs/skeleton";

  let isFocused: any = "";
</script>

<h2 class="h2">Log in</h2>
<form
  use:focusTrap={isFocused}
  method="POST"
  action="?/login"
>
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
    >Log in</button
  >
</form>
