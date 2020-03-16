import React, { useState, useEffect } from 'react'
// import { Layout, Menu, Avatar, BackTop, Dropdown, Icon } from 'antd';
// import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { message, Row, Col } from 'antd';
import DoctorItem from '../../../../component/DoctorItem';

import doctorClient from '../../../../api/doctor';
import departmentClient from '../../../../api/department';


import 'antd/dist/antd.css'
import './index.scss'

function DoctorList () {
  const [doctorList, setDoctorList] = useState<any>([]); //医生列表
  const [todaySchedule, setTodaySchedule] = useState<any>([]); // 今日排班计划
  const [doctorToday, setDoctorToday] = useState<any>([]);// 今日值班医生列表
  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表


  const fetchData = async() => {
    const departmentList:any = await departmentClient.getdepartments();
    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }

    const doctorList:any = await doctorClient.getDoctors({});

    if(doctorList.code === 0) {
      setDoctorList(doctorList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }

    const todaySchedule:any = await doctorClient.getScheduleToday();

    if(todaySchedule.code === 0) {
      setTodaySchedule(todaySchedule.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }
  }

  useEffect(()=> {
    // 初始化值班医生数据
    if (todaySchedule.length > 0 && doctorList.length > 0) {
      let arrayWork = []
      todaySchedule.forEach(item => {
        if(item.doctors) {
          arrayWork.push(...item.doctors.split(','));
        } 
      });

      let arrayDoctorWork = [];
      arrayWork.forEach(item => {
        arrayDoctorWork.push(doctorList.find(doctor => {
          return doctor.workerId === item;
        }));
      });

      setDoctorToday(arrayDoctorWork);
    }
  }, [todaySchedule, doctorList]);

  useEffect(()=> {
    fetchData();
  }, []);

  return (
    <Row className="DoctorList" gutter={16}>
      {
        doctorToday.map(item => {
          return (
            <Col span={4} key={item.workerId} >
             <DoctorItem departmentName={
              departmentList && departmentList.find(it => {
                return item.departmentId === it.departmentId
              }).departmentName
            } doctor={item}></DoctorItem>
            </Col>
          ) 
        })
      }
    </Row>
  );
}

export default DoctorList