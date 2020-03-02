import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import Home from '../view/Home/index';
import Patient from '../view/PatientView/Patient/index';
import Doctor from '../view/DoctoView/Doctor/index';

import userClient from '../api/user';

import { userLogin, userLogout } from '../actiosn/user'


import 'antd/dist/antd.css';
import './router.scss';

const mapStateToProps = (state: { user: any; }) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch: (arg0: { type: string; userInfo?: any; }) => void) => {
  return {
    onLogin: (userInfo: any) => {
      dispatch(userLogin(userInfo))
    },
    onLogout: () => {
      dispatch(userLogout())
    },
  }
}


function RootRoute(props: any) {
  useEffect(() => {
    userClient.getUser().then(res => {
      const myRes: any = res
      if(myRes.code === 0) {
        props.onLogin(myRes.data.user)
      }
    });
  }, []);

	return (
    <Switch>
      <Route exact path="/Home" component={Home}/>
      <Route path='/Patient'  component={Patient}/>
      <Route path="/Doctor" render={() => {
        return (
          props.user.type === 0
           ? (
            <Doctor></Doctor>
          ) : (
              <Redirect to="/Home" />
            )
          )} }/>
      <Redirect to='/Home'></Redirect>
    </Switch>
	);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootRoute);