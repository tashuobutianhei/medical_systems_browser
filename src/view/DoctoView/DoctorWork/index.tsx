import React, { useEffect, useState } from 'react'
import { Layout, Menu, message } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router-dom';
import patientCaseClient from '../../../api/patientCase';
import departmentClient from '../../../api/department';
import { CalendarOutlined, UnorderedListOutlined} from '@ant-design/icons';
import DocterWorkTable from '../../../component/DocterWorkTable'

import 'antd/dist/antd.css'
import './index.scss'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function DocterInfo (props: any & RouteComponentProps) {

  const [patientCases, setPatientCases] = useState<any>({});
  const [patientCasesHos, setPatientCasesHos] = useState<any>({});
  const [examination, setExaminationRes] = useState<any>({});

  useEffect(() => {
    const fetchDate = async () =>  {
      const res:any = await patientCaseClient.getPatientCaseById({workerId: props.user.workerId})
      if (res.code === 0) {
        
        // 诊断
        setPatientCases(res.data.filter(item => {
          return item.status === 0 ||item.status === null;
        }))

        // 住院
        setPatientCasesHos(res.data.filter(item => {
          return item.status === 2;
        }))
        
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


  return (
    <div>
      <Layout className="doctor-schedule">
        <Sider width={200} style={{ background: '#fff' }}> 
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
                病例表
              </span>
            }
          >
            {
              Array.isArray(patientCases) && patientCases.map((item,index) => {
                return (
                  <Menu.Item key={item.caseId} onClick={
                    () => {
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
                      props.history.push(`/Doctor/Home/${item.caseId}`)
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
                  <DocterWorkTable patientCase={patientCases} examination={examination}></DocterWorkTable>
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
  )(DocterInfo)
);