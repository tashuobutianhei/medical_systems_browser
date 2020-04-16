import React, { useEffect, useState } from 'react'
import { Layout, Menu, message, Input } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router-dom';
import patientCaseClient from '../../../api/patientCase';
import departmentClient from '../../../api/department';
import { CalendarOutlined } from '@ant-design/icons';
import DoctorWorkTable from '../../../component/DoctorWorkTable'

import 'antd/dist/antd.css'
import './index.scss'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function DoctorInfo (props: any & RouteComponentProps) {

  const [allpatientCases, setAllpatientCases] = useState<any>({}); // 全部
  const [patientCases, setPatientCases] = useState<any>({}); // 用于筛选
  const [examination, setExaminationRes] = useState<any>({});

  useEffect(() => {
    const fetchDate = async () =>  {
      const res:any = await patientCaseClient.getPatientCaseById({workerId: props.user.workerId})
      if (res.code === 0) {
        // 诊断
        setPatientCases(res.data.filter(item => {
          return item.status === 1 || item.status === 3;
        }))
        setAllpatientCases(res.data.filter(item => {
          return item.status === 1 || item.status === 3;
        }));
      } else {
        message.error({
          content: '服务错误'
        })
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
    fetchDate();
  }, []);

  const search = (val: string) => {
    if(!val) {
      setPatientCases(allpatientCases);
    } else {
      setPatientCases(allpatientCases.filter(item => {
        return (new RegExp(val).test(item.caseId) || new RegExp(val).test(item.patientInfo.name));
      }))
    }
  }


  return (
    <div>
      <Layout className="doctor-schedule">
        <Sider width={200} style={{ background: '#fff' }}> 
        <Input.Search key={'search'} placeholder="根据病例编号和姓名搜索" onSearch={search} />
        <Menu
          mode="inline"
          // defaultSelectedKeys={[getScheduleDateList()[0].toDateString()]}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <CalendarOutlined />
                病例记录本
              </span>
            }
          >
            {
              Array.isArray(patientCases) && patientCases.map((item,index) => {
                return (
                  <Menu.Item key={item.caseId} onClick={
                    () => {
                      props.history.push(`/Doctor/Cases/${item.caseId}`)
                    }
                  }
                  > {index+1} - {item.patientInfo.name}</Menu.Item>
                )
              })
            }
          </SubMenu>
          </Menu>
        </Sider>
        <Content className="content">
          <Switch>
              <Route exact path="/Doctor/Cases/:caseId" component={() => {
                return(
                  <DoctorWorkTable patientCase={patientCases} examination={examination}></DoctorWorkTable>
                )
              }} ></Route>
          </Switch>
        </Content>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state: { user: any; }) => {
  return {
    user: state.user
  }
}

export default withRouter(
  connect(
    mapStateToProps,
  )(DoctorInfo)
);