import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getCurrentExercise, updateExercise } from "Lib/exercise";

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
    currentExercise.progress = progress;
    updateExercise(currentExercise);
    this.setState({
      currentExercise: currentExercise
    })
    return 0;
  }

}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
  };
};

export default connect(mapStateToProps)(ExercisePage);
