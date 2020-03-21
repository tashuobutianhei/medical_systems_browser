import React from 'react'
import CONST from '../../common/const';
import { withRouter, RouteComponentProps } from 'react-router';


import 'antd/dist/antd.css'
import './index.scss'

type propsType = {
  doctor: any,
  departmentName: any
}

function DoctorList (props: propsType & RouteComponentProps) {
  const {doctor,departmentName } = props;
  return (
    <div className="doctorItem" onClick={() => {
      props.history.push(`/Patient/DoctorItem/${doctor.workerId}`)
    }}>
      <img src={doctor.avatar ? `http://localhost:3000${doctor.avatar}`: '/img/doctor1.jpeg'}></img>
      <div>
        <p>{doctor.name}</p>
        <p>{departmentName}-{CONST.DOCTOR_POSITION[doctor.position]}</p>
      </div>
    </div>
  );
}

export default withRouter(DoctorList)