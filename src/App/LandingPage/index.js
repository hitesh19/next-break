import React from "react";
import "./res/style.css";
import { connect } from "react-redux";
import { User, createUser } from "../../Lib/user";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};


  }

  render() {
    return (
    <div>
      <h1>
        Landing Page
      </h1>
      <div>
        <button onClick = {this.handleStart.bind(this)} >Start as new user</button>
      </div>
    </div>
    );
  }

  async handleStart(){
    //Decide a user name
    let userName = "NewUser_"+new Date().toISOString();
    let newUserOb = new User(userName, userName, "logo-001");
    let addRes = await createUser(newUserOb);
    if(addRes === userName){
      this.props.dispatch({
        "type" : "START_AS_NEW_USER",
        "userName" : userName
      });
    } else {
      alert("Error: Unable to create new user");
    }
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    app: state.app
  };
};


export default connect(
  mapStateToProps
)(LandingPage);
