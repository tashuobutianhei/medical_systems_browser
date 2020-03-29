import React, { useState, useEffect } from 'react'
import { message, Row, Col } from 'antd';
import DoctorItem from '../../../../component/DoctorItem';
import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../../api/graphql/gql';

import doctorClient from '../../../../api/doctor';

import 'antd/dist/antd.css'
import './index.scss'

function DoctorList (props:any) {
  const [doctorList, setDoctorList] = useState<any>([]); //医生列表
  const [todaySchedule, setTodaySchedule] = useState<any>([]); // 今日排班计划
  const [doctorToday, setDoctorToday] = useState<any>([]);// 今日值班医生列表
  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表


  const fetchData = async() => {
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

  useEffect(() => {
    if(props.data && props.data.Info) {
      const data = props.data.Info;
      setDepartmentList(data.departmentInfoList);

      let midArray = [];
      data.departmentInfoList.forEach(item => {
        midArray = [...midArray, ...item.doctorList]
      });

      setDoctorList(midArray);
    }
  }, [props]);
  
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

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(DoctorList)