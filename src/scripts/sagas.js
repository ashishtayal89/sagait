import {
  delay,
  call,
  spawn,
  fork,
  cancel,
  take,
  put,
  takeEvery,
  takeLatest
} from "./effects";

function logValue(value) {
  console.log(value);
}

// export function* saga1() {
//   const task = yield fork(saga1);
//   yield cancel(task);
//   yield fork(saga3);
//   yield put("LOG", 1);
//   yield put("LOG", 1);
// }

// export function* saga2() {
//   yield call(logValue, 1);
// }

export function* saga5() {
  yield call(logValue, 2);
}

// export function* saga3() {
//   yield call(logValue, 1);
//   yield delay(3000);
//   yield spawn(logValue, 2);
//   yield call(logValue, 3);
// }

// export function* saga4() {
//   const value = yield take("LOG");
//   console.log(value);
// }

// Saga to test TakeEvery and TakeLatest
// export function* takeLatestSaga() {
//   yield takeLatest("RESET", saga5);
// }

// export function* testTakeLatest() {
//   yield put("RESET");
//   yield put("RESET");
// }

export function* takeEverySaga() {
  yield takeEvery("RESET1", saga5);
}

export function* testTakeEvery1() {
  yield put("RESET1");
  yield put("RESET1");
}
