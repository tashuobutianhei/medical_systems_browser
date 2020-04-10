import React, { useEffect, useState } from 'react'
import { Layout, Menu, message, Input } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router-dom';
import patientCaseClient from '../../../api/patientCase';
import departmentClient from '../../../api/department';
import { CalendarOutlined, UnorderedListOutlined} from '@ant-design/icons';
import DoctorWorkTable from '../../../component/DoctorWorkTable'
import {resetPatient} from '../../../action/patientCase'; 

import 'antd/dist/antd.css'
import './index.scss'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function DoctorInfo (props: any & RouteComponentProps) {

  const [allpatientCases, setAllpatientCases] = useState<any>([]);
  const [patientCasesPat, setPatientCasesPat] = useState<any>([]);
  const [patientCasesHos, setPatientCasesHos] = useState<any>([]);
  const [examination, setExaminationRes] = useState<any>({});

  const [patientCases, setPatientCases] = useState<any>({});

  const formatPatientCases = (val = allpatientCases) => {
    // 诊断
    setPatientCasesPat(val.filter(item => {
      return item.status == 0 || item.status === null;
    }))
    // 住院
    setPatientCasesHos(val.filter(item => {
      return item.status == 2;
    }))
}

  const fetchDate = async () =>  {
    const res:any = await patientCaseClient.getPatientCaseById({workerId: props.user.workerId})
    if (res.code === 0) {
      setAllpatientCases(res.data);

      formatPatientCases(res.data);
      
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

  useEffect(() => {
    fetchDate();
  }, []);

  const search = (val: string) => {
    if(!val) {
      formatPatientCases();
    } else {
       // 诊断
      setPatientCasesPat(allpatientCases.filter(item => {
        return (item.status == 0 || item.status === null) && 
        (new RegExp(val).test(item.caseId) || new RegExp(val).test(item.patientInfo.name));
      }))
      // 住院
      setPatientCasesHos(allpatientCases.filter(item => {
        return  item.status == 2 &&  (new RegExp(val).test(item.caseId) || new RegExp(val).test(item.patientInfo.name));
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
          defaultOpenKeys={['sub1','sub2']}
          style={{ height: '100%', borderRight: 0 }}
        >
         
          <SubMenu
            key="sub1"
            title={
              <span>
                <CalendarOutlined />
                病例表
              </span>
            }
          >
            {
              Array.isArray(patientCasesPat) && patientCasesPat.map((item,index) => {
                return (
                  <Menu.Item key={item.caseId} onClick={
                    () => {
                      setPatientCases(patientCasesPat);
                      props.resetPatient();
                      props.history.push(`/Doctor/Home/${item.caseId}`)
                    }
                  }
                  > {index+1} - {item.patientInfo.name}</Menu.Item>
                )
              })
            }
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <UnorderedListOutlined />
                住院记录
              </span>
            }
          >
             {
              Array.isArray(patientCasesHos) && patientCasesHos.map((item,index) => {
                return (
                  <Menu.Item key={item.caseId} onClick={
                    () => {
                      setPatientCases(patientCasesHos);
                      props.resetPatient();
                      props.history.push(`/Doctor/Home/${item.caseId}`);
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
              <Route exact path="/Doctor/Home/:caseId" component={() => {
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

const mapDispatchToProps = (dispatch) => {
  return {
    resetPatient: () => {
      dispatch(resetPatient())
    },
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DoctorInfo)
);