import { effectNames, take, fork, cancel } from "./effects";

const listningSagas = {};

export function runSaga(saga, ...arg) {
  let sagaInstance = saga(...arg);
  if (isIterable(sagaInstance)) {
    let sagaName = saga.name;
    iterateSaga(sagaInstance, sagaName);
  }
}

function isIterable(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}

function iterateSaga(saga, sagaName, arg) {
  let yieldValue;
  do {
    const iteration =
      arg && arg.length ? saga.next(...arg) : saga.next(yieldValue);
    var isDone = iteration.done;
    var value = iteration.value;
    const effect = value ? value.effect : undefined;
    if (effect) {
      switch (effect) {
        case effectNames.DELAY: {
          const { timeStamp } = value;
          setTimeout(iterateSaga, timeStamp, saga, sagaName);
          return;
        }
        case effectNames.CALL: {
          yieldValue = handleCall(value);
          break;
        }
        case effectNames.SPAWN: {
          handleSpawnAndFork(value);
          break;
        }
        case effectNames.FORK: {
          yieldValue = handleSpawnAndFork(value);
          break;
        }
        case effectNames.CANCEL: {
          const { task } = value;
          clearTimeout(task);
          break;
        }
        case effectNames.TAKE: {
          const { action } = value;
          if (listningSagas[action])
            listningSagas[action].push({ saga, sagaName });
          else listningSagas[action] = [{ saga, sagaName }];
          return;
        }
        case effectNames.TAKELATEST: {
          const { action, saga } = value;
          runSaga(handleTakeLatest, action, saga);
          break;
        }
        case effectNames.TAKEEVERY: {
          const { action, saga } = value;
          runSaga(handleTakeEvery, action, saga);
          break;
        }
        case effectNames.PUT: {
          handlePut(value);
          break;
        }
        default:
          break;
      }
    }
  } while (!isDone);
  console.log(`Done Executing ${sagaName} saga`);
  return value;
}

function handleCall(value) {
  const { func, arg } = value;
  let sagaResponse;
  if (typeof func == "function") {
    sagaResponse = runSaga(func, ...arg);
  }
  return sagaResponse;
}

function handleSpawnAndFork(value) {
  const { func, arg } = value;
  let task;
  if (typeof func == "function") {
    task = setTimeout(
      () => {
        runSaga(func, ...arg);
      },
      0,
      arg
    );
  }
  return task;
}

function handlePut(value) {
  const { action, arg } = value;
  const sagas = listningSagas[action];
  if (sagas && sagas.length) {
    delete listningSagas[action];
    for (let { saga, sagaName } of sagas) {
      iterateSaga(saga, sagaName, arg);
    }
  }
}

export function* handleTakeLatest(action, saga) {
  while (true) {
    yield take(action);
    if (task) {
      yield cancel(task);
    }
    var task = yield fork(saga);
  }
}

export function* handleTakeEvery(action, saga) {
  while (true) {
    yield take(action);
    yield fork(saga);
  }
}

// CALL -> Return sagaReturnValue from runSaga

// PUT -> Do runSaga instead of iterateSaga from handlePut. Also check why we delete listning Sagas.
// export function runSaga(saga, ...arg) {
//   let sagaInstance = saga(...arg);
//   if (isIterable(sagaInstance)) {
//     let sagaName = saga.name;
//     return iterateSaga(sagaInstance, sagaName);
//   }
//   return sagaInstance;
// }
