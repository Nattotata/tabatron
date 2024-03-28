import { writable } from "svelte/store";

const initialState = {
  name: "initial state",
  email: "foo@bar.com",
};

export const userInfo = writable(initialState);

userInfo.reset = () => {
  userInfo.set(initialState);
};
