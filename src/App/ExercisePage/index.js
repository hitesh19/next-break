import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getCurrentExercise, updateExercise, EXERCISE_STATES } from "Lib/exercise";

class ExercisePage extends React.Component {

  state = {
    currentExercise: null,
    isLoaded: false,
    ExerciseComponent: null
  };

  async componentDidMount() {

    // Check if any Exercise is active
    let currentExercise = await getCurrentExercise();
    if (getCurrentExercise != null) {
      //Import the Exercise component
      let ExerciseModule = await import("Exercises/" + currentExercise.name);
      let ExerciseComponent = ExerciseModule.default;

      //Start the exercise
      currentExercise.currentState.exerciseState = EXERCISE_STATES.STARTED;
      if(currentExercise.progress === 0){
        currentExercise.startTime = new Date();
      }
      await updateExercise(currentExercise);

      this.setState({
        currentExercise: currentExercise,
        isLoaded: true,
        ExerciseComponent: ExerciseComponent
      })
    } else {
      //Go back to the waiting page
      this.props.dispatch({
        type: "START_AS_AWAITING_EXERCISE"
      })
    }
  }

  render() {

    if (this.state.isLoaded !== true) {
      return (
        <div>
          <h1>Exercise Page</h1>
          <div>Loading ...</div>
        </div>
      );
    }
    else {

      let ExerciseComponent = this.state.ExerciseComponent;

      return (
        <div>
          <h1>Exercise Page</h1>
          <div>Current Exercise : {this.state.currentExercise.name}</div>
          <div>Progress : {this.state.currentExercise.progress + " %"}</div>
          <hr/>
          {
            ExerciseComponent != null
              ?
              <ExerciseComponent
                updateProgress={this.updateProgress.bind(this)}
                currentExercise={this.state.currentExercise}
              />
              :
              null
          }
        </div>
      );



    }

  }

  async updateProgress(progress) {

    let currentExercise = this.state.currentExercise;
    

    if(progress >= 0 && progress < 100){
      //Progress update
      currentExercise.progress = progress;
      await updateExercise(currentExercise);
      this.setState({
        currentExercise: currentExercise
      })
      return 0;
    } else if(progress  === 100){
      //Exercise completed
      currentExercise.progress = 100;
      currentExercise.currentState.exerciseState = EXERCISE_STATES.FINISHED;
      currentExercise.endTime = new Date();
      await updateExercise(currentExercise);
      this.setState({
        currentExercise: currentExercise
      })
      //TODO: Ask scheduler to re-schedule the completed exercise
      this.props.dispatch({
        "type" : "START_AS_AWAITING_EXERCISE"
      })
      return 0; //This will probably not execute as the page is about to change
    } else {
      return -1; //Out of range Error
    }
  }

}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
  };
};

export default connect(mapStateToProps)(ExercisePage);
