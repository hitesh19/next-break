import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getExercises } from "../../Lib/exercise";
import moment from "moment";

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      exerciseCount: 0,
      pendingExercises: [],
      pendingExerciseCount: 0
    };
  }

  async componentDidMount() {
    // Check if any exercise is scheduled
    let allExercises = await getExercises(new Date());
    let exerciseCount = allExercises.length;
    let pendingExercises = allExercises.filter((ex)=>{
      if(moment(ex.startTime) <= moment()){
        return true
      } else {
        return false
      }
    })
    this.setState({
      isLoaded: true,
      exerciseCount: exerciseCount,
      pendingExercises: pendingExercises,
      pendingExerciseCount: pendingExercises.length
    });
  }

  render() {
    if (this.state.isLoaded !== true) {
      return (
        <div>
          <h1>Waiting Page</h1>
          <div>Loading ...</div>
        </div>
      );
    }

    return (
      <div>
        <h1>Waiting Page</h1>
        <div>Number of upcoming exercises : {this.state.exerciseCount}</div>
        <div>Number of pending exercises : {this.state.pendingExerciseCount}</div>
      </div>
    );
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};

export default connect(mapStateToProps)(WaitingPage);
