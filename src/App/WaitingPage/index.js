import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { getExercises } from "../../Lib/exercise";

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      exerciseCount: 0
    };
  }

  async componentDidMount() {
    // Check if any exercise is scheduled
    let allExercises = await getExercises(new Date());
    let exerciseCount = allExercises.length;
    this.setState({
      isLoaded: true,
      exerciseCount: exerciseCount
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
