<h2 class="h2">Change password</h2>
<form action="?/changePassword" method="post">
  <label class="label">
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

    <span>Staré heslo</span>
    <input
      name="oldPassword"
      class="input"
      title="Old password"
      type="password"
      placeholder="old password"
    />
  </label>
  <label class="label">
    <span>Nové heslo</span>
    <input
      name="newPassword"
      class="input"
      title="New password"
      type="password"
      placeholder="new password"
    />
  </label>
  <button class="btn mt-2 variant-filled-primary"
    >Změň heslo</button
  >
</form>
