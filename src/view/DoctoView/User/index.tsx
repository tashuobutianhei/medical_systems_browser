import React from 'react'
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';

import UserInfo from '../UserGroup/UserInfo';

import 'antd/dist/antd.css'
import './index.scss'


const {  Content, Sider } = Layout;

function User (props: RouteComponentProps) {

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
         <Menu.Item key="userInfo" onClick={() => {
          props.history.push(`/Patient/user/userInfo`)
        }}>个人信息</Menu.Item>
        </Menu>
      </Sider>
      <Content className="content">
        <Switch> 
          <Route exact path="/Doctor/User/userInfo" component={UserInfo}/>
          <Redirect to='/Doctor/User/userInfo'></Redirect>
        </Switch>
      </Content>
    </Layout>
  </div>
  );
}

export default withRouter(User);

