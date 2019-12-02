import { runSaga } from "./middleware";
import * as sagas from "./sagas";

for (let key in sagas) {
  runSaga(sagas[key]);
}
