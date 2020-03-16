import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import './index.scss'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';



type propsType = {
  departmentInfo: any
}

function DoctorInfo (props: propsType & RouteComponentProps) {

  const [doctorList, setDoctorList] = useState<any>([]);

  const initDoctorList = () => {
    const info = props.departmentInfo.doctorList;
    if(info.length <= 6) {
      setDoctorList(info);
    } else {
      setDoctorList(info.slice(0,5)); 
    }
  };

  useEffect(() => {
    if (Object.keys(props.departmentInfo).length > 0) {
      initDoctorList();
    }
    
  }, [props.departmentInfo])

  return (
    <div className="departmentCard">
      <Row justify="space-between">
        <Col className="departmentCard-title" onClick={()=>{
            props.history.push(`/Patient/DepartmentItem/${props.departmentInfo.departmentId}`)
          }}>
          {props.departmentInfo.departmentName}
        </Col>
        <Col>
          <RightOutlined onClick={()=>{
            props.history.push(`/Patient/DepartmentItem/${props.departmentInfo.departmentId}`)
          }}/>
        </Col>
      </Row>
      <hr className="departmentCard-line" />
      <Row justify="space-between">
        {
          doctorList.map(item => {
            return (
              <Col span={8} key={item.workerId} className="departmentCard-name"
              onClick={()=>{
                props.history.push(`/Patient/DoctorItem/${item.workerId}`)
              }}>
                {item.name}
              </Col>
            )
          })
        }
      </Row>
    </div>
  );
}

export default withRouter(DoctorInfo);