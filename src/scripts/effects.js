export const effectNames = Object.freeze({
  DELAY: "delay",
  CALL: "call",
  SPAWN: "spawn",
  FORK: "fork",
  CANCEL: "cancel",
  TAKE: "take",
  TAKELATEST: "takeLatest",
  TAKEEVERY: "takeEvery",
  PUT: "put"
});

export const delay = timeStamp => ({ timeStamp, effect: effectNames.DELAY });
export const call = (func, ...arg) => ({ func, arg, effect: effectNames.CALL });
export const spawn = (func, ...arg) => ({
  func,
  arg,
  effect: effectNames.SPAWN
});
export const fork = (func, ...arg) => ({ func, arg, effect: effectNames.FORK });
export const cancel = task => ({ task, effect: effectNames.CANCEL });
export const take = action => ({ action, effect: effectNames.TAKE });
export const put = (action, ...arg) => ({
  action,
  arg,
  effect: effectNames.PUT
});
export const takeLatest = (action, saga) => ({
  action,
  saga,
  effect: effectNames.TAKELATEST
});
export const takeEvery = (action, saga) => ({
  action,
  saga,
  effect: effectNames.TAKEEVERY
});
