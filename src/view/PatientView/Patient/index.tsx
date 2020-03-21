import React, { useState, useEffect } from 'react'
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Route, Switch, withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { ClockCircleOutlined, BarsOutlined, VerifiedOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { connect } from 'react-redux'

import 'antd/dist/antd.css'
import './index.scss'

import DoctorInfo from '../DoctorInfo';
import PatientHome from '../PatientHome';
import Department from '../Department';
import Order from '../Order';
import Guide from '../Guide';
import DoctorItem from '../DoctorItem';
import DepartmentItem from '../DepartmentItem';
import User from '../User';

import {LoginRegModal as LogRegFormModal} from '../../../component/loginAndReg'
import { userLogin, userLogout } from '../../../action/user';
import jsCookie from 'js-cookie';

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

type PatientType = {
  user: any
  onLogin(userInfo: any): void
  onLogout(): void
}

function Patient (props: PatientType & RouteComponentProps) {

  let [LoginRegModalVisable, changLoginRegModalVisable] = useState<boolean>(false);
  
  const logout = () => {
    jsCookie.remove('the_docters_token', {path: '/'});
    props.onLogout();
    props.history.push(`/`)
  }

  const menu = (
    <Menu>
      <Menu.Item key="my" onClick={() => {
        props.history.push('/Patient/user')
      }}>个人中心</Menu.Item>
      <Menu.Item key="logout" onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  const toggleModalVisable = (visable: boolean) => {
    changLoginRegModalVisable(visable);
  }
  
  let key = props.location.pathname.split('/')[2];

  return <>
  <LogRegFormModal 
    visible={LoginRegModalVisable} 
    toggleModalVisable={toggleModalVisable}
    loginSuccess={(userInfo) => {
      props.onLogin(userInfo)
    }}
  ></LogRegFormModal>
        <div className="PatientHome-fixed">
        <div className="PatientHome-fixed-item" onClick={() => {
          props.history.push(`/Patient/Order`)
        }}>
          <span className="PatientHome-fixed-item-logo"><ClockCircleOutlined/></span>
          <span className="PatientHome-fixed-item-text">预约挂号</span>
        </div>
        <div className="PatientHome-fixed-item" onClick={() => {
          props.history.push(`/Patient/Guide`)
        }}>
          <span className="PatientHome-fixed-item-logo"><BarsOutlined/></span>
          <span className="PatientHome-fixed-item-text">门诊查询</span>
        </div>
        <div className="PatientHome-fixed-item" onClick={() => {
          props.history.push(`/Patient/Department`)
        }}>
          <span className="PatientHome-fixed-item-logo"><VerifiedOutlined/></span>
          <span className="PatientHome-fixed-item-text">特色科室</span>
        </div>
        <div className="PatientHome-fixed-item">
          <span className="PatientHome-fixed-item-logo"><ArrowUpOutlined /></span>
          <span className="PatientHome-fixed-item-text">
            <a href="#">返回顶部 </a>
          </span>
        </div>
      </div>
  <div id="particles-js"></div>
  <Layout className="layout">
    <Header className="header">
      <img src="/img/logo.png" onClick={(e: any) => {
            props.history.push(`/Home`)
      }}></img>
      <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[key]}
          onClick={(e: any) => {
            props.history.push(`/Patient/${e.key}`)
          }}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="Home">首页</Menu.Item>
          <Menu.Item key="Order">医疗挂号</Menu.Item>
          <Menu.Item key="Department">科室导航</Menu.Item>
          <Menu.Item key="DoctorInfo">医生介绍</Menu.Item>
          <Menu.Item key="Guide">就医指南</Menu.Item>
          <div className="myvalue">
          {
             props.user &&  props.user.username &&  props.user.type == 1 ?
              <div>
                <Avatar src={props.user.avatar ? `http://localhost:3000${props.user.avatar}` : ''}/>
                <Dropdown overlay={menu} className="div">
                  <a className="ant-dropdown-link" href="#">
                    <span>{ props.user.username}</span>
                    <DownOutlined />
                  </a>
                </Dropdown>
              </div>
              :
              <div>
                <Avatar icon={<UserOutlined />} />
                <span className="div" 
                onClick={()=>{
                  changLoginRegModalVisable(!LoginRegModalVisable);
                }}
                style={{ color: 'white', cursor: 'pointer' }}>登录</span>
              </div>
          }
          </div>
        </Menu>
    </Header>
    <Content className="patient-content">
      <div className="patient-route">
      <Switch> 
          <Route exact path="/Patient/Home" component={PatientHome}/>
          <Route path="/Patient/order" component={Order} />
          <Route path="/Patient/doctorInfo" component={DoctorInfo} />
          <Route path="/Patient/department" component={Department}/>
          <Route path="/Patient/guide" component={Guide}/>

          <Route path="/Patient/user" component={User}/>
  
          <Route path="/Patient/DoctorItem/:workerId" component={DoctorItem}/>
          <Route path="/Patient/DepartmentItem/:departmentId" component={DepartmentItem}/>
          <Redirect to='/Patient/Home'></Redirect>
        </Switch>
      </div>
    </Content>
    <Footer className="patient-footer">The Doctors medical systems ©2020 Created by lizilong @ 软件工程 2016 02</Footer>
  </Layout>
  </>;
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Patient)
);