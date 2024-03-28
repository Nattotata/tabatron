<script lang="ts">
  import { userInfo } from "$stores/user";

  import {
    Toast,
    getToastStore,
  } from "@skeletonlabs/skeleton";
  import type {
    ToastSettings,
    ToastStore,
  } from "@skeletonlabs/skeleton";

  import type { PageData, ActionData } from "./$types";
  import LoginForm from "./LoginForm.svelte";
  import RegisterForm from "./RegisterForm.svelte";

  const toastStore: ToastStore = getToastStore();

  export let data: PageData;
  export let form: ActionData;

  if (form?.status === 201) {
    toastStore.trigger({ message: "foo" });
  }
</script>

{#if form?.status === 201}
  <h2>Something done successfully</h2>
{/if}
<p>Jméno ze stóru: {$userInfo.name}</p>
<p>Mail ze stóru: {$userInfo.email}</p>

<form action="?/logOut" method="post">
  <button class="btn">Odhlaš se</button>
</form>

<form action="?/removeAccount" method="post">
  <button class="btn">Smaž účet</button>
</form>

<form action="?/changePassword" method="post">
  <button class="btn">Změň heslo</button>
</form>

<hr />
<LoginForm />
<RegisterForm />
