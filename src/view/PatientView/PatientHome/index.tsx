import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import CONST from '../../../common/const';
import {CSSTransition} from 'react-transition-group';
import { HomeTwoTone, HeartTwoTone, ProfileTwoTone, IdcardTwoTone, } from '@ant-design/icons';
import departmentClient from '../../../api/department';
import doctorClient from '../../../api/doctor';
import patientCaseClient from '../../../api/patientCase';

import { ForwardFilled, RightOutlined } from '@ant-design/icons';
import { Carousel, Row, Col, Button, message, Statistic,BackTop } from 'antd';
import DoctorItem from '../../../component/DoctorItem';

import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'

const CarouselList = ['lun1.jpg','lun2.jpg', 'lun3.jpg'];

const GudieList = [
  {
    name: '科室门诊表',
    color: '#62999d',
    textColor: 'white',
    path: 'Guide'
  },
  {
    name: '就医须知',
    color: '#dac594',
    textColor: 'black',
    path: 'Guide'
  },
  {
    name: '值班医师',
    color: '#306f3d',
    textColor: 'white',
    path: 'DoctorInfo'
  }
]
function Home (props: any) {

  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表
  const [doctorList, setDoctorList] = useState<any>([]); //医生列表
  const [patientCaseList, setPatientCaseList] = useState<any>([]); // 挂号数据，用于展示
  const [todaySchedule, setTodaySchedule] = useState<any>([]); // 今日排班计划

  const [departmentInfo, setDepartmentInfo] = useState<any>({}); // 当前激活科室信息
  const [doctorToday, setDoctorToday] = useState<any>([]);// 今日值班医生列表

  const fetchData = async() => {

    const patientCaseList:any = await patientCaseClient.getPatientAll();

    if(patientCaseList.code === 0) {
      setPatientCaseList(patientCaseList.data);
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

  const reduceTodaySchedule = (todaySchedule) => {
    let TodaySchedule = [];
    todaySchedule && todaySchedule.forEach(item => {
      if(item.doctors) {
        TodaySchedule.push(...item.doctors.split(','));
      } 
    });
    return TodaySchedule;
  }

  const mouseEnterDepartment = (departmentId) => {
    setDepartmentInfo(departmentList.find(item => {
      return item.departmentId === departmentId
    }) || {});
  };

  useEffect(()=> {
    // 初始化值班医生数据
    if (todaySchedule.length > 0 && doctorList.length > 0) {
      mouseEnterDepartment(1);

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
    <div className="PatientHome">
      <Carousel autoplay={true} effect="fade" className="PatientHome-Carousel">
        {
          CarouselList.map(item => {
            return <img src={'/img/' + item} key={item}></img>
          })
        }
      </Carousel>
      <div className="PatientHome-body">

      <CSSTransition
          in={true}
          classNames="PatientHomeTransition"
          unmountOnExit//是否占茅坑
          timeout={5000}//消失延迟
          appear = {true}
      >
        <div className="PatientHome-body-gudie">
          {
            GudieList.map((item, index) => {
              return (
                <div key={index} style={{color: item.textColor, backgroundColor: item.color}} onClick={()=>{
                  props.history.push(`/Patient/${item.path}`)
                }}>
                  <span>{item.name}</span>
                </div>
              )
            })
          }
        </div>
      </CSSTransition>

      <div className="PatientHome-body-department">
   
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="科室总数" value={departmentList && departmentList.length} prefix={<HomeTwoTone />} />
          </Col>

          <Col span={6}>
            <Statistic title="医生力量" value={doctorList && doctorList.length} prefix={<HeartTwoTone />} />
          </Col>

          <Col span={6}>
            <Statistic title="挂号统计" value={patientCaseList && patientCaseList.length} prefix={<ProfileTwoTone />} />
          </Col>

          <Col span={6}>
            <Statistic title="今日值班" value={reduceTodaySchedule(todaySchedule).length} prefix={<IdcardTwoTone />} />
          </Col>
        </Row>

      </div>


      <div className="PatientHome-body-department">
        <p className="PatientHome-body-department-gudie"  onClick={()=>{
          props.history.push(`/Patient/Department`)}
        }>
          科室导航 
          <ForwardFilled />
        </p>
        <Row gutter={16}>
          <Col span={8} className="PatientHome-body-department-img">
            <img src="/img/department.jpeg"></img>
            <div className="PatientHome-body-department-img-info">
              <p>{departmentInfo.departmentName}</p>
              <div>{departmentInfo.information}</div>
            </div>
          </Col>
          <Col span={16} className="PatientHome-body-department-info">
            {
              departmentList && departmentList.map((item,index) =>{
                return (
                  <Button 
                  onMouseEnter={(e)=>{
                    mouseEnterDepartment(item.departmentId)
                  }}
                  onClick={(e) => {
                    props.history.push(`/Patient/DepartmentItem/${item.departmentId}`);
                  }}
                  type="dashed" size="large" 
                  key={item.departmentId} style={{width: '130px', marginRight: '8px'}}>
                    {item.departmentName}
                    <RightOutlined />
                  </Button>
                );
              })
            }
          </Col>
        </Row>
      </div>

      <div className="PatientHome-body-doctor">
        <p className="PatientHome-body-doctor-gudie"  onClick={()=>{
          props.history.push(`/Patient/Department`)}
        }>
          今日医师
          <ForwardFilled />
        </p>
        <Row gutter={16}>
          {
            doctorToday.map(item => {
              return (
                <Col span={4} key={item.workerId}>
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
      </div>
      </div> 
    </div>
  );
}

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(withRouter(Home));