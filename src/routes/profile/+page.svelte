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
  import ChangePasswordForm from "./ChangePasswordForm.svelte";

  const toastStore: ToastStore = getToastStore();

  export let data: PageData;
  export let form: ActionData;

  if (form?.message) {
    const getToastStyle = (status: string) => {
      switch (status) {
        case "success":
          return "variant-filled-success";
        case "error":
          return "variant-filled-error";
        default:
          return "variant-filled-warning";
      }
    };
    const style = getToastStyle(String(form?.status));
    toastStore.trigger({
      message: String(form?.message),
      background: style,
    });
  }
</script>

<p>Jméno ze stóru: {$userInfo.name}</p>
<p>Mail ze stóru: {$userInfo.email}</p>

<form action="?/logOut" method="post">
  <button class="btn">Odhlaš se</button>
</form>

<form action="?/removeAccount" method="post">
  <button class="btn">Smaž účet</button>
</form>

<hr />
<LoginForm />
<RegisterForm />
<ChangePasswordForm />
