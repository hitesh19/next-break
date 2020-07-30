import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import {getCurrentExercise} from "Lib/exercise";

class ExercisePage extends React.Component {

  state={
    currentExercise: null,
    isLoaded: false
  };
  
  async componentDidMount(){
    
    // Check if any Exercise is active
    let currentExercise = await getCurrentExercise();
    if(getCurrentExercise != null){
      this.setState({
        currentExercise: currentExercise,
        isLoaded: true
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
    } else {
      return (
        <div>
          <h1>Exercise Page</h1>
          <div>Current Exercise : {this.state.currentExercise.name}</div>
          <div>Progress : {this.state.currentExercise.progress}</div>
        </div>
        
      )
    }
    
    
  }
  
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
  };
};

export default connect(mapStateToProps)(ExercisePage);
