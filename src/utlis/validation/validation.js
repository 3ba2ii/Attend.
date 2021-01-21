export function validateEmail(email) {
  if (!email) {
    return false;
  }
  if (email.includes('@')) {
    let emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailRegExp.test(email);
  }
  let usernameRegExp = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/g;
  return usernameRegExp.test(email);
}

export function validatePassword(password) {
  if (!password) return false;

  let passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;
  return passwordRegExp.test(password);
}
