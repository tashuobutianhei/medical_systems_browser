import React from 'react'
import { ForwardFilled, RightOutlined } from '@ant-design/icons';
import { Carousel, Row, Col, Button } from 'antd';
import { withRouter } from 'react-router-dom'
import {CSSTransition} from 'react-transition-group';

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
    path: 'DocterInfo'
  }
]

const departmentList = [
  {
    name: '内科'
  }
]

const docters = [
  {
    workerId: '1001',
    name: 'lxx',
    position: '主任',
    departmentName: '内科'
  }
]

function Home (props: any) {
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
        <p className="PatientHome-body-department-gudie"  onClick={()=>{
          props.history.push(`/Patient/Department`)}
        }>
          科室导航 
          <ForwardFilled />
        </p>
        <Row gutter={16}>
          <Col span={8} className="PatientHome-body-department-img">
            <img src="/img/department.jpeg"></img>
          </Col>
          <Col span={16} className="PatientHome-body-department-info">
            {
              departmentList.map((item,index) =>{
                return (
                  <Button type="dashed" size="large" key={index} style={{width: '130px'}}>
                    {item.name}
                    <RightOutlined />
                  </Button>
                );
              })
            }
          </Col>
        </Row>
      </div>

      <div className="PatientHome-body-docter">
        <p className="PatientHome-body-docter-gudie"  onClick={()=>{
          props.history.push(`/Patient/Department`)}
        }>
          今日医师
          <ForwardFilled />
        </p>
        <Row gutter={16}>
          {
            docters.map(item => {
              return (
                <Col span={4} key={item.workerId}>
                  <div className="PatientHome-body-docter-img">
                    <img src="/img/docter1.jpeg"></img>
                    <div>
                      <p>{item.name}</p>
                      <p>{item.departmentName}-{item.position}</p>
                    </div>
                  </div>
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

export default withRouter(Home)