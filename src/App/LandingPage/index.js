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
    <div className='landing-page display-flex align-items-center flex-direction-column justify-content-space-evenly'>
      <div className='hero-content display-flex align-items-center flex-direction-column'>
        <span>NEXT BREAK</span>
        <p>Your convivial excercise companion</p>
      </div>
      <div className='get-started-btn ease display-flex align-items-center'>
        <button onClick = {this.handleStart.bind(this)} >GET STARTED</button>
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
