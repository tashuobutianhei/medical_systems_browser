import React, { useState, useEffect } from 'react'
import adminClient from '../../../api/admin';
import { message, Table, Statistic, Row, Col, Button } from 'antd';
import { LikeOutlined, AppstoreAddOutlined, PlusCircleOutlined, HeartTwoTone, HomeTwoTone } from '@ant-design/icons';
import AdminDepartmentTable from '../../../component/AdminDepartmentTable';
import AddDepartmentModal from '../../../component/AddDepartmentModal';
import AddDoctorModal from '../../../component/AddDoctorModal';

import './index.scss';

const  AdminDepartment = () => {

  const [departmentList, setDepartmentList] = useState<any>([]);
  const [doctors, setDoctors] = useState<number>(0);

  const [addDepartmentVisable, setAddDepartmentVisable] = useState<boolean>(false);
  const [addDoctorVisable, setAddDoctorVisable] = useState<boolean>(false);

  const init = async () => {
    const res:any = await adminClient.getDepartmentExpendDoctor();
    if(res.code === 0) {
      setDepartmentList(res.data);

      let count = 0;
      res.data.forEach(item => {
        count += item.doctorList.length
      })

      setDoctors(count);

    } else {
      message.error({
        content: '服务错误'
      })
    }
  }

  useEffect(() => {
    init();
  }, []);

  const success = () => {
    init();
  }

  return (
    <>
    <AddDepartmentModal 
      addDepartmentVisable={addDepartmentVisable}
      setAddDepartmentVisable={setAddDepartmentVisable}
      success={success}></AddDepartmentModal>
    <AddDoctorModal 
      departmentList={departmentList}
      addDoctorVisable={addDoctorVisable}
      setAddDoctorVisable={setAddDoctorVisable}
      success={success}></AddDoctorModal>
    <Row className="adminDepartment">
        <Col span="2" className="adminDepartment-handle">
          <div className="adminDepartment-handle-body">
            <Button 
            className="adminDepartment-handle-body-button" 
            type="primary" 
            shape="round"
            icon={<PlusCircleOutlined />}
            onClick= {() => {
              setAddDepartmentVisable(true);
            }}
            >添加科室</Button>
            <Button 
            className="adminDepartment-handle-body-button" 
            type="primary" 
            shape="round"
            onClick= {() => {
              setAddDoctorVisable(true);
            }}
            icon={<AppstoreAddOutlined />}
            >添加医生</Button>
            <Statistic title="科室总数" value={departmentList.length} prefix={<HomeTwoTone />} />
            <Statistic title="在职医生" value={doctors} prefix={<HeartTwoTone />} />
          </div>
        </Col>
        <Col span="22" className="adminDepartment-table">
          <AdminDepartmentTable departmentList={departmentList} success={success}></AdminDepartmentTable>
        </Col>
    </Row>
    </>
  );
}

export default AdminDepartment;