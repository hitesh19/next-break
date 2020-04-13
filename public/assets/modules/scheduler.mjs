import { getExercises, updateExercise } from "../modules/exercise.mjs";

const TIMEINTERVAL = 1;
const SCHEDULERSRCPATH = "../assets/js/notifier.js";
let notifierWorker;

async function updateExerciseToPending(exercise) {
  let selectedExercise = Object.assign({}, exercise);
  selectedExercise.currentState = "PENDING";

  updateExercise(selectedExercise);

  displayNotification("Its time to Exercise");
}

(function () {
  setInterval(async function () {
    let now = new Date(),
      oneMinMinusNow = new Date(
        new Date().setMinutes(now.getMinutes() - TIMEINTERVAL)
      ),
      selectedExercises = await getExercises(oneMinMinusNow, now);

    if (selectedExercises && selectedExercises.length > 0) {
      selectedExercises.forEach((exercise) => {
        updateExerciseToPending(exercise);
      });
    }
  }, TIMEINTERVAL * 60 * 1000);
})();
