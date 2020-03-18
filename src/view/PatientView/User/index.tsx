import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import UserInfo from '../UserGroup/UserInfo';

import 'antd/dist/antd.css'
import './index.scss'

const { Header, Content, Footer, Sider } = Layout;

function User (props) {
  return (
    <div>
      <Layout className="doctor-schedule">
      <Sider width={200} style={{ background: '#fff' }}> 
      <Menu
        mode="inline"
        defaultSelectedKeys={['userInfo']}
        defaultOpenKeys={['sub1','sub2']}
        style={{ height: '100%', borderRight: 0 }}
      >
         <Menu.Item key="userInfo">个人信息</Menu.Item>
         <Menu.Item key="userPatientCases">病例本</Menu.Item>
        </Menu>
      </Sider>
      <Content className="content">
        <Switch> 
          <Route exact path="/Patient/user/userInfo" component={UserInfo}/>
          <Redirect to='/Patient/user/userInfo'></Redirect>
        </Switch>
      </Content>
    </Layout>
  </div>
  );
}

export default withRouter(User);

