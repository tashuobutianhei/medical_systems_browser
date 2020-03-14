import React from 'react'
import CONST from '../../common/const';

import 'antd/dist/antd.css'
import './index.scss'

type propsType = {
  doctor: any,
  departmentName: any
}

function DoctorList (props: propsType) {
  const {doctor,departmentName } = props;
  return (
    <div className="doctorItem">
      <img src="/img/docter1.jpeg"></img>
      <div>
        <p>{doctor.name}</p>
        <p>{departmentName}-{CONST.DOCTOR_POSITION[doctor.position]}</p>
      </div>
    </div>
  );
}

export default DoctorList