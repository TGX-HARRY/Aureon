// authStore.js
let user = null;

export function getUser() {
  return user;
}

export function setUser(u) {
  user = u;
}

export function clearUser() {
  user = null;
}

