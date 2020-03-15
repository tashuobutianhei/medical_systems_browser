import React, { useState, useEffect } from 'react'
import DepartmentItem from '../../../component/DepartmentItem';
import departmentClient from '../../../api/department';

import 'antd/dist/antd.css'
import './index.scss'
import { message, Row, Col, Breadcrumb } from 'antd';

function Deprartment () {


  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表


  const fetchData = async () => {
    const departmentList:any = await departmentClient.getdepartments();
    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data);
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
          <span>科室</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>科室导航</Breadcrumb.Item>
      </Breadcrumb>

      <p className="department-title">科室导航</p>

      <Row gutter={16}>
        {
          departmentList && departmentList.map(item => {
            return (
              <Col key={item.DeprartmentId} span={4}>
                <DepartmentItem department={item}></DepartmentItem>
              </Col>
            ) 
          })
        }
      </Row>
    </div>
  );
}

export default Deprartment;