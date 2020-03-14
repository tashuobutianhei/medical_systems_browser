import React, { useEffect, useState } from 'react'
// import { Carousel, Row, Col, Button, message, Statistic,BackTop, Switch } from 'antd';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import GuideShedule from '../GuideGroup/Schedule';

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
function Home (props: any) {

  const fetchData = async() => {
 
  }

  useEffect(()=> {
    fetchData();
  }, []);

  return (
    <div className="PatientGuide">
      <div className="PatientGuide-body"> 
        <CSSTransition
            in={true}
            classNames="PatientHomeTransition"
            unmountOnExit//是否占茅坑
            timeout={5000}//消失延迟
            appear = {true}
        >
          <div className="PatientGuide-title">
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

        <div className="PatientGuide-route">
          <Switch> 
            <Route exact path="/Patient/Guide/Schedule" component={GuideShedule}/>
            <Redirect to='/Patient/Guide/Schedule'></Redirect>
          </Switch>
        </div>
      </div>
      
     
    </div>
  );
}

export default withRouter(Home)