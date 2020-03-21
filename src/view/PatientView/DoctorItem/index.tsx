import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router';
import { Row, Col, Button, Breadcrumb, message, Divider } from 'antd'
import {  HomeOutlined } from '@ant-design/icons';
import CONST from '../../../common/const';

import departmentClient from '../../../api/department';
import doctorClient from '../../../api/doctor';

import 'antd/dist/antd.css'
import './index.scss'


function DoctorItem (props: any) {

  const [departmentList,  setDepartmentList] = useState<any>([]); // 科室列表
  const [doctor, setDoctor] = useState<any>({}); //医生列表


  const fetchData = async () => {
    const departmentList:any = await departmentClient.getdepartments();
    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }

    const doctorList:any = await doctorClient.getDoctors({
      workerId: props.match.params.workerId
    });

    if(doctorList.code === 0) {
      setDoctor(doctorList.data[0]);
    } else {
      message.error({
        content: '服务错误'
      })
    }

  }

  const reduceDepartmentName = () => {
    const itemDepartment =  departmentList && departmentList.find(item => {
      return item.departmentId === doctor.departmentId
    })

    return itemDepartment ? itemDepartment.departmentName : ''
  }

  useEffect(() => {
    if (props.match.params.workerId) {
      fetchData()
    }
  },[props.match.params.workerId]);

  return (
    <div className="DoctorItem">
      <Breadcrumb>
        <Breadcrumb.Item href="">
        <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>医生简介</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{doctor && doctor.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row  className="DoctorItem-body" gutter={32}>
        <Col span={6}>
          <img src={doctor.avatar ? `http://localhost:3000${doctor.avatar}`: '/img/doctor1.jpeg'}></img>
        </Col>
        <Col span={18}>
          <Row>
            <Col span={20}>
              <p className="DoctorItem-body-name">{doctor && doctor.name}</p>
              <p className="DoctorItem-body-position">
                {reduceDepartmentName()}
                {CONST.DOCTOR_POSITION[doctor && doctor.position]} 
              </p>
              <p className="DoctorItem-body-value">
                毕业于 {doctor && doctor.university} --- 身份证 {
                  doctor && doctor.idcard
                }
              </p>
              <Divider orientation="left">详细介绍</Divider>
              <div className="DoctorItem-body-info">{doctor && doctor.information}</div>
            </Col>
            <Col span={4}>
              <Button shape="round">查看科室其他医生</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(DoctorItem);