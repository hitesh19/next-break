import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getExercises } from "../../Lib/exercise";

class WaitingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      activeExercises: undefined
    };
  }
  
  async checkForActiveExercises(){
    //TODO: Check if any exercise is scheduled
    let exercises = await getExercises();
    if(exercises && exercises.length > 0){
      let activeExercises = exercises.filter((e)=>(e.isActive()));
      this.setState({
        activeExercises: activeExercises,
        isLoaded: true
      });  
    } else {
      this.setState({
        activeExercises: [],
        isLoaded: true
      });
    }
  }

  async componentDidMount() {
    let timerId = setInterval(this.checkForActiveExercises.bind(this), 5000);
    this.setState({
      "timerId" : timerId
    })
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
    let activeExerciseCount = this.state.activeExercises.length;
    if(activeExerciseCount > 0){
      let selectedExercise = this.state.activeExercises[0];
      return (
        <div>
          <h1>Waiting Page</h1>
          <div>You have a exercise due! Click Start Exercise to begin exercising and stay fit.</div>
      <div>Exercise Name: {selectedExercise.name}</div>
          <button onClick={()=>{alert("TODO")}}>Start Exercise</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Waiting Page</h1>
          <div>You don't have any pending exercise yet. Pin this browser tab and you will be notified when an exercise is due.</div>
          <div>Till then, Keep up the good work!</div>
        </div>
      );
    }
    
  }

  componentWillUnmount(){
    if(this.state.timerId){
      clearInterval(this.state.timerId);
    }
  }
  
  
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};

export default connect(mapStateToProps)(WaitingPage);
