import React, { useEffect } from 'react'
// import { Carousel, Row, Col, Button, message, Statistic,BackTop, Switch } from 'antd';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import GuideShedule from '../GuideGroup/Schedule';
import Info from '../GuideGroup/Info';
import DoctorList from '../GuideGroup/DoctorList'
import ExaminationTable from '../GuideGroup/ExaminationTable';

import 'antd/dist/antd.css'
import './index.scss'


const GudieList = [
  {
    name: '科室门诊表',
    color: '#62999d',
    textColor: 'white',
    path: 'Schedule'
  },
  {
    name: '就医须知',
    color: '#dac594',
    textColor: 'black',
    path: 'Info'
  },
  {
    name: '化验项目',
    color: '#ffffff',
    textColor: 'black',
    path: 'Examination'
  },
  {
    name: '值班医师',
    color: '#306f3d',
    textColor: 'white',
    path: 'DoctorList'
  },
  
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
                    props.history.push(`/Patient/Guide/${item.path}`)
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
            <Route  path="/Patient/Guide/Info" component={Info}/>
            <Route  path="/Patient/Guide/DoctorList" component={DoctorList}/>
            <Route  path="/Patient/Guide/Examination" component={ExaminationTable}/>
            <Redirect to='/Patient/Guide/Schedule'></Redirect>
          </Switch>
        </div>
      </div>
      
     
    </div>
  );
}

export default withRouter(Home)