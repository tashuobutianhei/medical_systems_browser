
import React, { useState, useEffect } from 'react'
import {message, Row, Col, Breadcrumb } from 'antd';
import SchduleCommon from '../../../component/ScheduleCommon';
import DoctorItem from '../../../component/DoctorItem';

import departmentClient from '../../../api/department';
import doctorClient from '../../../api/doctor';


import { ProfileTwoTone, IdcardTwoTone, EyeTwoTone } from '@ant-design/icons';


import 'antd/dist/antd.css'
import './index.scss'
import { withRouter } from 'react-router';

const guide = [
  {
    text:'门诊查询',
    icon: <EyeTwoTone style={{fontSize: '70px'}}/>,
    path: '/Patient/Guide/Schedule',
  }, {
    text:'就医需知',
    icon: <ProfileTwoTone style={{fontSize: '70px'}}/>,
    path: '/Patient/Guide/Info',
  }, {
    text:'值班医生',
    icon: <IdcardTwoTone style={{fontSize: '70px'}}/>,
    path: '/Patient/Guide/DoctorList',
  }
]


function DepartmentItem (props: any) {

  const [departmentList, setDepartmentList] = useState<any>({}); // 科室列表
  const [doctorList, setDoctorList] = useState<any>([]); // 科室列表

  const fetchData = async () => {

    const departmentList:any = await departmentClient.getdepartments({
      departmentId: props.match.params.departmentId
    });

    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data[0]);
    } else {
      message.error({
        content: '服务错误'
      })
    }

    const doctorList:any = await doctorClient.getDoctors({
      departmentId: props.match.params.departmentId
    });

    if(doctorList.code === 0) {
      setDoctorList(doctorList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }
  };

  useEffect(() => {
    if (props.match.params.departmentId) {
      fetchData();
    }
  },[props.match.params]);

  return (
    <div className="departmentItem">

      <Breadcrumb>
        <Breadcrumb.Item href="">
          <span>科室</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>科室导航</Breadcrumb.Item>
        <Breadcrumb.Item>{departmentList.departmentName}</Breadcrumb.Item>
      </Breadcrumb>
     
      <Row className="departmentItem-info"  justify="space-between">
        <Col className="departmentItem-info-item" lg={12} xs={24}>
          <p className="departmentItem-title">科室简介</p>
          <div>
            {departmentList.information}
          </div>
        </Col>
        <Col className="departmentItem-info-item" lg={11} xs={24}>
          <p className="departmentItem-title">就医指南</p>
          <Row justify="space-between">
            {
               guide.map(item => {
                 return(
                   <Col key={item.text} className="departmentItem-card" onClick={() => {
                    props.history.push(item.path);
                   }}>
                     <div>
                       {item.icon}
                      <p>{item.text}</p>
                     </div>
                  </Col>
                 )
               })
            }
          </Row>
        </Col>
      </Row>
      
      <div className="departmentItem-schdule">
        <SchduleCommon departmentList={[departmentList]} type="data" ></SchduleCommon>
      </div>

      <div className="departmentItem-doctor">
        <p className="departmentItem-title">科室医生</p>
        <Row justify="space-between">
          {
            doctorList.map(doctor => {
              return (
                <Col key={doctor.workerId} span={4}>
                  <DoctorItem doctor={doctor} departmentName={departmentList.departmentName}></DoctorItem>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </div>
  )
}

export default withRouter(DepartmentItem)
