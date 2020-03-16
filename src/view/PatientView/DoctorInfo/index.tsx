import React, { useState, useEffect } from 'react'
import adminClient from '../../../api/admin';

import 'antd/dist/antd.css'
import './index.scss'
import { message, Row, Col, Breadcrumb } from 'antd';
import DepartmentExpendDoctor from '../../../component/DepartmentExpendDoctor'


function DoctorInfo () {

  const [info, setInfo] = useState<any>([]);

  const fetchData = async () => {

    const res:any = await adminClient.getDepartmentExpendDoctor();

    if(res.code === 0) {
      setInfo(res.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <div className="department">
       <Breadcrumb>
        <Breadcrumb.Item href="">
          <span>首页</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>医生简介</Breadcrumb.Item>
      </Breadcrumb>

      <p className="department-title">医生简介</p>

      <Row gutter={32}>
        {
          info && info.map(item => {
            return (
              <Col key={item.departmentId} span={6}>
                <DepartmentExpendDoctor departmentInfo={item}>
                </DepartmentExpendDoctor>
              </Col>
            )
          })
        }
      </Row>
    </div>
  );
}

export default DoctorInfo