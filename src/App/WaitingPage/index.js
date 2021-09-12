import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getCurrentExercise } from "Lib/exercise";

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      currentExercise: undefined,
    };
  }

  async checkForActiveExercises() {
    let currentExercise = await getCurrentExercise();

    if (currentExercise != null) {
      this.setState({
        currentExercise: currentExercise,
        isLoaded: true,
      });
    } else {
      this.setState({
        currentExercise: null,
        isLoaded: true,
      });
    }
  }

  async componentDidMount() {
    let timerId = setInterval(this.checkForActiveExercises.bind(this), 5000);
    this.setState({
      timerId: timerId,
    });
  }

  // render() {

  //   if (this.state.isLoaded !== true) {
  //     return (
  //       <div>
  //         <h1>Waiting Page</h1>
  //         <div>Loading ...</div>
  //       </div>
  //     );
  //   }
  //   let currentExercise = this.state.currentExercise;
  //   if(currentExercise != null){
  //     return (
  //       <div>
  //         <h1>Waiting Page</h1>
  //         <div>You have a exercise due! Click Start Exercise to begin exercising and stay fit.</div>
  //     <div>Exercise Name: {currentExercise.name}</div>
  //         <button onClick={this.handleExerciseStart.bind(this)}>Start Exercise</button>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <h1>Waiting Page</h1>
  //         <div>You don't have any pending exercise yet. Pin this browser tab and you will be notified when an exercise is due.</div>
  //         <div>Till then, Keep up the good work!</div>
  //       </div>
  //     );
  //   }

  // }

  render() {
    let status = null;
    let actionButton = null;
    if (this.state.isLoaded !== true) {
      status = <div>Loading status...</div>;
    } else {
      let currentExercise = this.state.currentExercise;
      if (currentExercise != null) {
        status = (
          <div>
            <div>You have an exercise due!</div>
            <br />
            <div>
              Exercise Name:{" "}
              <span className="waiting-exercise-name">
                {currentExercise.name}
              </span>
            </div>
            <br />
            <div>Click Start Exercise to begin exercising and stay fit.</div>
          </div>
        );

        actionButton = (
          <button
            className="waiting-btn"
            onClick={this.handleExerciseStart.bind(this)}
          >
            Start
          </button>
        );
      } else {
        status = (
          <div>
            <div>
              You don't have any PENDING exercise yet.
            </div>
            <br/>
            <div>PIN this browser tab and you will be NOTIFIED when an exercise is due.</div>
            <br/>
            <div>Till then, Keep up the good work!</div>
          </div>
        );
      }
    }

    return (
      <div className="waiting-container">
        <div className="waiting-header">
          <div className="waiting-header-logo">NEXT BREAK</div>
        </div>
        <div className="waiting-welcome-msg">
          Hey{" "}
          <span className="waiting-user-name">{this.props.app.userName}</span> !
        </div>
        <div className="waiting-status-area">{status}</div>
        <div className="waiting-actions">{actionButton}</div>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
  }

  handleExerciseStart() {
    this.props.dispatch({
      type: "START_EXERCISE",
    });
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps)(WaitingPage);
