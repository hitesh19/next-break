import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import {
  Setting,
  createSetting,
  getSettings,
  updateSetting
} from "../../Lib/setting";
import { Exercise, createExercise, getExercises } from "../../Lib/exercise";
import moment from "moment";
import { requestNotificationPermission } from "../../Lib/notifier";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      exerciseInterval: 30,
      useCamera: true
    };
  }

  async componentDidMount() {
    // Load existing settings (if available)
    let settings = {};
    settings["exerciseInterval"] = this.state.exerciseInterval;
    settings["useCamera"] = this.state.useCamera;
    let allSettings = await getSettings();
    if (allSettings && allSettings.length > 0) {
      for (let setting of allSettings) {
        if (setting.name === "exerciseInterval") {
          settings["exerciseInterval"] = setting.value;
          break;
        }

        if (setting.name === "useCamera") {
          settings["useCamera"] = settings.value;
        }
      }
    }

    //Update settings
    this.setState({
      exerciseInterval: settings["exerciseInterval"],
      useCamera: settings["useCamera"]
    });

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
            name="exerciseInterval"
            value={this.state.exerciseInterval}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <br />
        <div>
          Use Camera :
          <input
            type="checkbox"
            name="useCamera"
            checked={this.state.useCamera}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <br />
        <button onClick={this.handleSubmit.bind(this)}>Save</button>
      </div>
    );
  }

  handleChange(event) {
    let ob = {};
    ob[event.target.name] = event.target.value;
    this.setState(ob);
  }

  async saveSetting(settingName, settingValue) {
    //Check if setting already exists
    let isFound = false;
    let existingSetting = null;
    let allSettings = await getSettings();
    if (allSettings && allSettings.length > 0) {
      for (let setting of allSettings) {
        if (setting.name === settingName) {
          isFound = true;
          existingSetting = setting;
          break;
        }
      }
    }

    if (isFound === false) {
      // No setting exists, create new
      let newSetting = new Setting(settingName, settingName, settingValue);
      await createSetting(newSetting);
    } else {
      // Update existing setting
      existingSetting.value = settingValue;
      updateSetting(existingSetting);
    }
  }

  async handleSubmit() {
    // save "exerciseInterval"
    await this.saveSetting("exerciseInterval", {
      label: "Exercise interval",
      duration: this.state.exerciseInterval
    });

    // save "useCamera"
    await this.saveSetting("useCamera", this.state["useCamera"]);

    // Request Notification permission
    await requestNotificationPermission();

    // Create First Exercise
    let allExercises = await getExercises();
    if (!(allExercises && allExercises.length > 0)) {
      let newExercise = new Exercise(
        "exercise1",
        "exercise1",
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
    }

    // Update app state (if required)
    this.props.dispatch({
      type: "SETTINGS_SAVED"
    });
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};

export default connect(mapStateToProps)(SettingsPage);
