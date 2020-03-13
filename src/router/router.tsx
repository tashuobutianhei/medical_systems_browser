import React, { useEffect } from 'react';
import { Route, Switch, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import Home from '../view/Home/index';
import Patient from '../view/PatientView/Patient/index';
import Doctor from '../view/DoctoView/Doctor/index';
import Admin from '../view/AdminView/Admin/index';

import userClient from '../api/user';

import { userLogin, userLogout } from '../action/user'


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


function RootRoute(props: any & RouteComponentProps) {

  useEffect(() => {
    userClient.getUser().then(res => {
      const myRes: any = res
      if(myRes.code === 0) {
        props.onLogin(myRes.data.user);
      }
    });
  }, []);

  useEffect(() => {
    if(props.user && props.user.workerId && props.user.type == 2) {
      props.history.push(`/Doctor`);
    }
    if(props.user && props.user.type == 0) {
      props.history.push(`/Admin`);
    }
  }, [props.user]);


	return (
    <Switch>
      <Route exact path="/Home" component={Home}/>
      <Route path='/Patient'  component={Patient}/>
      <Route path="/Doctor" render={() => {
        return (
          props.user.type === 2
           ? (
            <Doctor></Doctor>
          ) : (
              <Redirect to="/Home" />
            )
          )} }/>
      <Route path="/Admin" render={() => {
        return (
          props.user.type == 0
          ? (
          <Admin></Admin>
        ) : (
            <Redirect to="/Home" />
          )
        )} }/>
      <Redirect to='/Home'></Redirect>
    </Switch>
	);
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RootRoute)
);