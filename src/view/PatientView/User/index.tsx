import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import moment from 'moment';

import UserInfo from '../UserGroup/UserInfo';
import DoctorWorkTable from '../../../component/DoctorWorkTable';

import patientCaseClient from '../../../api/patientCase';
import departmentClient from '../../../api/department';

import 'antd/dist/antd.css'
import './index.scss'

import SubMenu from 'antd/lib/menu/SubMenu';

const { Header, Content, Footer, Sider } = Layout;

function User (props: RouteComponentProps) {

  const [patientCases, setPatientCases] = useState<any>([]);
  const [examination, setExaminationRes] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await patientCaseClient.getPatientCaseUser();
      if (res.code != 0) {
        message.error('服务错误')
      } else {
        setPatientCases(res.data);
      }

      const examinationRes:any = await departmentClient.getExamination();
      if (examinationRes.code === 0) {
        setExaminationRes(examinationRes.data);
      } else {
        message.error({
          content: '服务错误'
        })
      }
    }
    fetchData();
  }, [])

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
         <SubMenu
            key="sub1"
            title={
              <span>
                病例记录本
              </span>
            }
          >
          {
            patientCases.map(item => {
              return (
                <Menu.Item key={item.caseId}  onClick={() => {
                  props.history.push(`/Patient/user/userInfo/${item.caseId}`)
                }}
                >{moment(item.registerDate).format('YYYY-MM-DD HH')}</Menu.Item>
              )
            })
          }
         </SubMenu>
        
        </Menu>
      </Sider>
      <Content className="content">
        <Switch> 
          <Route exact path="/Patient/user/userInfo" component={UserInfo}/>
          <Route exact path="/Patient/user/userInfo/:caseId" component={() => {
                return(
                  <DoctorWorkTable patientCase={patientCases} examination={examination} which="patient"></DoctorWorkTable>
                )
              }}/>
          <Redirect to='/Patient/user/userInfo'></Redirect>
        </Switch>
      </Content>
    </Layout>
  </div>
  );
}

export default withRouter(User);

