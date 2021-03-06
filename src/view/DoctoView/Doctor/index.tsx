import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Route, Switch, withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { userLogin, userLogout } from '../../../action/user';
import jsCookie from 'js-cookie';

import DoctorCase from '../DoctorCase/index';
import DoctorWork from '../DoctorWork/index';
import DoctorSchedule from '../DoctorSchedule/index';
import DoctorInfo from '../User/index';

import 'antd/dist/antd.css'
import './index.scss'

const { Header, Content, Footer } = Layout;

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

type userType = {
  user: any
  onLogin(userInfo: any): void
  onLogout(): void
}

function Doctor (props: userType & RouteComponentProps) {
  const logout = () => {
    jsCookie.remove('the_docters_token', {path: '/'});
    props.onLogout();
    props.history.push(`/`)
  }

  const menu = (
    <Menu>
      <Menu.Item key="my" onClick={() => {
        props.history.push('/Doctor/User');
      }}>个人中心</Menu.Item>
      <Menu.Item key="logout" onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  const userInfo = props.user;

  let key = props.location.pathname.split('/')[2];


  return <>
  <Layout className="layout">
    <Header className="header">
      <img src="/img/logo.png" alt="logo" onClick={(e: any) => {
            props.history.push(`/Home`)
      }}></img>
      <Menu
          theme="dark"
          mode="horizontal"
          key={props.location.pathname.split('/')[2]}
          defaultSelectedKeys={[key]}
          onClick={(e: any) => {
            props.history.push(`/Doctor/${e.key}`)
          }}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="Home">工作台</Menu.Item>
          <Menu.Item key="Cases">病例本</Menu.Item>
          {
            userInfo.position === 'director' ? 
            <Menu.Item key="Schedule">排班</Menu.Item>: null
          }
          <div className="myvalue">
            <Avatar src={ userInfo.avatar ? `http://localhost:3000${userInfo.avatar}`: '' }/>
            <Dropdown overlay={menu} className="div">
              <a className="ant-dropdown-link" href="#">
                <span>{userInfo.name}</span>
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </Menu>
    </Header>
    <Content className="doctor-content">
      <div className="doctor-route">
        <Switch>
            <Route path="/Doctor/Home" component={DoctorWork}/>
            <Route path="/Doctor/Cases" component={DoctorCase} />
            <Route path="/Doctor/Schedule" component={DoctorSchedule} />

            <Route path="/Doctor/User" component={DoctorInfo} />
            <Redirect to='/Doctor/Home'></Redirect>
        </Switch>
      </div>
    </Content>
    <Footer className="doctor-footer">The Doctors medical systems ©2020 Created by lizilong @ 软件工程 2016 02</Footer>
  </Layout>
  </>;
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Doctor)
);