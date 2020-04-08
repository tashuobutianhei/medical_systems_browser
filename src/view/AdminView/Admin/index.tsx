import React, { useState } from 'react'
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Route, Switch, withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { userLogin, userLogout } from '../../../action/user';
import jsCookie from 'js-cookie';

import AdminInfo from '../AdminInfo/index';
import AdminUser from '../AdminUser/index';
import AdminDepartment from '../AdminDepartment/index'
import AdminText from '../AdminText/index';
import AdminTextItem from '../AdminTextEdit/index';

import 'antd/dist/antd.css'
import './index.scss'

const { Header, Content, Footer, Sider } = Layout;

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
      <Menu.Item key="my" >个人中心</Menu.Item>
      <Menu.Item key="logout" onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  const userInfo = props.user;

  return <>
  <Layout className="layout">
    <Header className="header">
      <img src="/img/logo.png" onClick={(e: any) => {
            props.history.push(`/Home`)
      }}></img>
      <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['User']}
          onClick={(e: any) => {
            props.history.push(`/Admin/${e.key}`)
          }}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="User">注册用户</Menu.Item>
          <Menu.Item key="Department">科室管理</Menu.Item>
          <Menu.Item key="Info">信息维护</Menu.Item>
          <Menu.Item key="Text">公告/文章</Menu.Item>
          {/* {
            userInfo.position === 'director' ? 
            <Menu.Item key="Schedule">排班</Menu.Item>: null
          } */}
          <div className="myvalue">
            {/* <Avatar icon={<UserOutlined />}/> */}
            <span>管理端-{props.user.username}-{props.user.uid}</span>
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
            <Route path="/Admin/User" component={AdminUser}/>
            <Route path="/Admin/Department" component={AdminDepartment} />
            <Route path="/Admin/Info" component={AdminInfo} />
            <Route path="/Admin/Text" component={AdminText} />
            <Route path="/Admin/TextEdit/:textId" component={AdminTextItem} />
            <Redirect to='/Admin/User'></Redirect>
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