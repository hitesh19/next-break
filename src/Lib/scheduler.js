import { getExercises, updateExercise, EXERCISE_STATES } from "./exercise";
import { displayNotification } from "./notifier";

const TIMEINTERVAL = 1;
let setIntervalId = null;

async function updateExerciseToPending(exercise) {
  let selectedExercise = Object.assign({}, exercise);
  selectedExercise.currentState["exerciseState"] = EXERCISE_STATES.PENDING;

  updateExercise(selectedExercise);

  await displayNotification("Its time to Exercise");
}

export function initScheduler() {
  let fn = async function () {
    let now = new Date(),
      oneMinMinusNow = new Date(
        new Date().setMinutes(now.getMinutes() - TIMEINTERVAL)
      ),
      selectedExercises = await getExercises(oneMinMinusNow, now);

    if (selectedExercises && selectedExercises.length > 0) {
      for (let exercise of selectedExercises) {
        await updateExerciseToPending(exercise);
      }
    }
  };

  setIntervalId = setInterval(fn, TIMEINTERVAL * 60 * 1000);
}

export function stopScheduler() {
  if (setIntervalId !== null) {
    clearInterval(setIntervalId);
  }
}
