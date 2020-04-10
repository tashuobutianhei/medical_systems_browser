import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import CONST from '../../../common/const';
import {CSSTransition} from 'react-transition-group';
import { HomeTwoTone, HeartTwoTone, ProfileTwoTone, IdcardTwoTone, } from '@ant-design/icons';
import departmentClient from '../../../api/department';
import adminClient from '../../../api/admin';
import doctorClient from '../../../api/doctor';
import patientCaseClient from '../../../api/patientCase';
import moment from 'moment';

import { ForwardFilled, RightOutlined } from '@ant-design/icons';
import { Carousel, Row, Col, Button, message, Statistic,BackTop } from 'antd';
import DoctorItem from '../../../component/DoctorItem';

import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'

const GudieList = [
  {
    name: '科室门诊表',
    color: '#62999d',
    textColor: 'white',
    path: 'Guide'
  },
  {
    name: '就医须知',
    color: '#fff',
    textColor: 'black',
    path: 'Guide'
  },
  {
    name:'img',
    path:'img1.jpg'
  },
  {
    name:'img',
    path:'img2.jpg'
  },
  {
    name:'img',
    path:'img3.jpg'
  },
  {
    name:'img',
    path:'img4.jpg'
  },
  {
    name: '值班医师',
    color: '#306f3d',
    textColor: 'white',
    path: 'DoctorInfo'
  },
  {
    name: '预约挂号',
    color: '#dac594',
    textColor: 'black',
    path: 'Order'
  }
]

type artcle = {
  title: string,
  update: string
  textId: number
};

function Home (props: any) {

  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表
  const [doctorList, setDoctorList] = useState<any>([]); //医生列表
  const [patientCaseList, setPatientCaseList] = useState<any>([]); // 挂号数据，用于展示
  const [todaySchedule, setTodaySchedule] = useState<any>([]); // 今日排班计划

  const [departmentInfo, setDepartmentInfo] = useState<any>({}); // 当前激活科室信息
  const [doctorToday, setDoctorToday] = useState<any>([]);// 今日值班医生列表
  const [CarouselList, setCarouselList] = useState<string[]>([]); // 轮播图片

  const [artcleList0, setArtcleList0] = useState<artcle[]>([]);
  const [artcleList1, setArtcleList1] = useState<artcle[]>([]);

  const fetchData = async() => {
    // 获取数据
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

    const res:any = await adminClient.findArtcle();
    const array0 = [];
    const array1 = [];
    if(res.code === 0) {
      res.data.forEach(item => {
        if(item.type == 0 && array0.length < 8) {
          array0.unshift(item);
        } else if (item.type == 1 && array1.length < 8){
          array1.unshift(item);
        }
      });
      setArtcleList0(array0);
      setArtcleList1(array1);
    } else {
      message.error('服务错误哦');
    }
  }

  const reduceTodaySchedule = (todaySchedule) => {
    // 计算今日值班
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

      setCarouselList(data.commonInfo.carousel.split(',').filter(item => {
        return item !== ''
      }));
    }
  }, [props]);

  return (
    <>
    <div className="PatientHome-bg"></div>
    <div className="PatientHome">
     
      <Carousel autoplay={true} effect="fade" className="PatientHome-Carousel">
        {
          CarouselList.length > 0 ?
          CarouselList.map(item => {
            return <img src={`http://localhost:3000${item}`} key={item}></img>
          }) : 
          <img src={'/img/lun1.jpg'}></img>
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
              if (item.name === 'img') {
                return(
                  <img className="PatientHome-body-gudie-item" src={`/img/${item.path}`}></img>
                )
              } else {
                return(
                  <div className="PatientHome-body-gudie-item"
                  key={index} style={{color: item.textColor, backgroundColor: item.color}} onClick={()=>{
                    props.history.push(`/Patient/${item.path}`)
                  }}>
                    <span>{item.name}</span>
                  </div>
                )
              }
            })
          }
        </div>
      </CSSTransition>

      <div className="PatientHome-body-data">
        <div className="PatientHome-body-data-body">
          <p className="PatientHome-body-department-gudie" style={{
            color: 'black'
          }}> 数据统计</p>
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
      </div>

      <div className="PatientHome-body-arctle">
        <Row justify="space-between" >
          <Col md={12} className="PatientHome-body-arctle-item" xs={24}>
            <div className="PatientHome-body-arctle-item-header">
              <span style={{
                borderBottom: '4px solid #0065B3'
              }}>医院动态</span>
              <span onClick={() => {
                props.history.push('/Patient/Atrcle/')
              }}>更多</span>
            </div>
            <div>
              {
                artcleList0.map(item => {
                  return (
                    <p key={item.textId} onClick={() => {
                      props.history.push(`/Patient/Atrcle/${item.textId}`)
                    }}>
                      <span>{item.title}</span>
                      <span>{moment(item.update).format('YYYY年MM月DD日')}</span>
                    </p>
                  )
                })
              } 
            </div>
          </Col>
          <Col md={11} className="PatientHome-body-arctle-item"  xs={24}>
            <div className="PatientHome-body-arctle-item-header">
                <span style={{
                borderBottom: '4px solid #0065B3'
              }}>医疗文章</span>
                 <span onClick={() => {
                    props.history.push('/Patient/Atrcle/')
                  }}>更多</span>
              </div>
              <div>
              {
                artcleList1.map(item => {
                  return (
                    <p key={item.textId} onClick={() => {
                      props.history.push(`/Patient/Atrcle/${item.textId}`)
                    }}>
                      <span>{item.title}</span>
                      <span>{moment(item.update).format('YYYY年MM月DD日')}</span>
                    </p>
                  )
                })
              } 
            </div>
          </Col>
        </Row>
      </div>


      <div className="PatientHome-body-department">
        <p className="PatientHome-body-department-gudie"  onClick={()=>{
          props.history.push(`/Patient/Department`)}
        }> 科室导航  </p>
        <Row gutter={16} className="PatientHome-body-department-body">
          <Col span={8} className="PatientHome-body-department-img">
            <img src="/img/department.jpeg"></img>
            <div className="PatientHome-body-department-img-info">
              <p>{departmentInfo.departmentName}</p>
              <div>{departmentInfo.information}</div>
            </div>
          </Col>
          <Col span={16} className="PatientHome-body-department-info">
            <Row>
              {
                departmentList && departmentList.map((item,index) =>{
                  return (
                    <Col key={item.departmentId} style={{width: '130px', marginRight: '8px'}}> 
                      <a 
                        onMouseEnter={(e)=>{
                          mouseEnterDepartment(item.departmentId)
                        }}
                        onClick={(e) => {
                          props.history.push(`/Patient/DepartmentItem/${item.departmentId}`);
                        }}
                        type="dashed" 
                      >{item.departmentName}</a>
                    </Col>
                  );
                })
              }
            </Row>
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
    </>
  );
}

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(withRouter(Home));