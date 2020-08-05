import React from "react";
import "./res/style.css";
import { connect } from "react-redux";

const DURATION = 60000;

class Walk extends React.Component {

  state = {
    isLoaded: false,
    currentProgress: 0,
    isFinished: false
  };

  async componentDidMount() {
    let currentExercise = this.props.currentExercise;

    //Sample Iniitialization
    setTimeout(() => {
      let timerId = setInterval(this.updateProgress.bind(this), DURATION / 10);
      this.setState({
        isLoaded: true,
        currentProgress: currentExercise.progress,
        timerId: timerId
      })
    }, 5000);
  }

  async updateProgress() {
    let cp = this.state.currentProgress;
    let isFinished = this.state.isFinished;
    if (cp < 90) {
      let newProg = cp + 10;
      let updateRetCode = await this.props.updateProgress(newProg);
      if (updateRetCode === 0) {
        this.setState({
          currentProgress: newProg
        })
      } else {
        console.log("Progress update not successful");
      }
    } else {
      if (!isFinished) {
        let updateRetCode = await this.props.updateProgress(100);
        if (updateRetCode === 0) {
          this.setState({
            currentProgress: 100,
            isFinished: true
          })
        } else {
          console.log("Progress update not successful");
        }

      } else {
        //For testing only
        await this.props.updateProgress(0);
        this.setState({
          currentProgress: 0,
          isFinished: false
        })
      }
    }
  }

  render() {

    if (this.state.isLoaded !== true) {
      return (
        <div>
          <div>Initializing exercise...</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>Time to take a walk! Please stand up and walk for 1 minute (or more).</div>
        </div>

      )
    }


  }

  componentWillUnmount() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
  };
};

export default connect(mapStateToProps)(Walk);
