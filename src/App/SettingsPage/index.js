import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import {
  Setting,
  createSetting,
  getSettings,
  updateSetting
} from "../../Lib/setting";
import { Exercise, createExercise } from "../../Lib/exercise";
import moment from "moment";
import { requestNotificationPermission } from "../../Lib/notifier";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      exerciseInterval: 30
    };
  }

  async componentDidMount() {
    // Load existing settings (if available)
    let isFound = false;
    let exerciseIntervalSetting = null;
    let allSettings = await getSettings();
    if (allSettings && allSettings.length > 0) {
      for (let setting of allSettings) {
        if (setting.name === "exerciseInterval") {
          isFound = true;
          exerciseIntervalSetting = setting;
          break;
        }
      }
    }

    if (isFound === true) {
      this.setState({
        exerciseInterval: exerciseIntervalSetting.value
      });
    }
    this.setState({
      isLoaded: true
    });
  }

  render() {
    if (this.state.isLoaded !== true) {
      return (
        <div>
          <h1>Settings Page</h1>
          <div>Loading ...</div>
        </div>
      );
    }

    return (
      <div>
        <h1>Settings Page</h1>
        <div>
          Welcome {this.props.app.userName} ! Configure settings below -
        </div>
        <br />
        <div>
          Exercise Interval (mins) :
          <input
            type="number"
            value={this.state.exerciseInterval}
            onChange={this.handleChange.bind(this)}
          />
          <button onClick={this.handleSubmit.bind(this)}>Save</button>
        </div>
      </div>
    );
  }

  handleChange(event) {
    this.setState({
      exerciseInterval: event.target.value
    });
  }

  async handleSubmit() {
    //Check if setting already exists
    let isFound = false;
    let exerciseIntervalSetting = null;
    let allSettings = await getSettings();
    if (allSettings && allSettings.length > 0) {
      for (let setting of allSettings) {
        if (setting.name === "exerciseInterval") {
          isFound = true;
          exerciseIntervalSetting = setting;
          break;
        }
      }
    }

    if (isFound === false) {
      // No setting exists, create new
      let newSetting = new Setting("exerciseInterval", "exerciseInterval", {
        label: "Exercise interval",
        duration: this.state.exerciseInterval
      });
      await createSetting(newSetting);

      // Create First Exercise
      let newExercise = new Exercise(
        "neck-exercise-1",
        "neck-exercise-1",
        new Date(
          moment()
            .add(this.state.exerciseInterval, "minutes")
            .toISOString()
        ),
        new Date(
          moment()
            .add(this.state.exerciseInterval, "minutes")
            .add(2, "minute")
            .toISOString()
        ),
        ["neck"],
        { setsRequired: 10, recommendedInterval: 2 },
        { setsCompleted: 0 },
        0
      );
      await createExercise(newExercise);
      await requestNotificationPermission();
      this.props.dispatch({
        type: "SETTINGS_CREATED"
      });
    } else {
      if (exerciseIntervalSetting.value !== this.state.exerciseInterval) {
        // Value changed, update existing setting
        exerciseIntervalSetting.value = this.state.exerciseInterval;
        updateSetting(exerciseIntervalSetting);
      } else {
        // No need to update, keep existing settings
      }
    }
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};

export default connect(mapStateToProps)(SettingsPage);
