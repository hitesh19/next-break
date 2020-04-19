import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import LandingPage from "./LandingPage";
import SettingsPage from "./SettingsPage";
import WaitingPage from "./WaitingPage";
import { USER_STATES } from "./res/constants";
import { getUsers } from "../Lib/user";
import { getSettings } from "../Lib/setting";
import {initScheduler} from "../Lib/scheduler";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {

    await this.loadApp(this.props);
    initScheduler();
  }

  async loadApp(props) {
    // Retrieve list of users to see if the user is already initiated
    let users = await getUsers();
    if (users && users.length > 0) {
      props.dispatch({
        type: "LOAD_USER",
        userName: users[0].nickname
      });

      //Check if settings are configured
      let isFound = false;
      // let exerciseIntervalSetting = null;
      let allSettings = await getSettings();
      if (allSettings && allSettings.length > 0) {
        for (let setting of allSettings) {
          if (setting.name === "exerciseInterval") {
            isFound = true;
            // exerciseIntervalSetting = setting;
            break;
          }
        }
      }

      if (isFound === true) {
        props.dispatch({
          type: "START_AS_AWAITING_EXERCISE"
        });
      } else {
        props.dispatch({
          type: "START_AS_AWAITING_USER_SETTINGS"
        });
      }
    } else {
      props.dispatch({
        type: "START_ON_LANDING_PAGE"
      });
    }
  }

  render() {
    if (this.props.app.userState === USER_STATES.INITIALIZING) {
      return <div>Loading ...</div>;
    } else if (
      this.props.app.userState === USER_STATES.AWAITING_USER_CREATION
    ) {
      return <LandingPage />;
    } else if (
      this.props.app.userState === USER_STATES.AWAITING_USER_SETTINGS
    ) {
      return <SettingsPage />;
    } else if (this.props.app.userState === USER_STATES.AWAITING_EXERCISE) {
      return <WaitingPage />;
    } else {
      return <div>Error : Unknown App State</div>;
    }
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};

export default connect(mapStateToProps)(App);
