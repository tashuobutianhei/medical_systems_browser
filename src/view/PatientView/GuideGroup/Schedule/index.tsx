
import React, { useState, useEffect } from 'react'
import {message } from 'antd';
import SchduleCommon from '../../../../component/ScheduleCommon';

import departmentClient from '../../../../api/department';

import 'antd/dist/antd.css'
import './index.scss'



function Schedule (props: any) {

  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表


  const fetchData = async () => {
    const departmentList:any = await departmentClient.getdepartments();
    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <div className="order-table">
      <SchduleCommon departmentList={departmentList} type="data"></SchduleCommon>
    </div>
  )
}

export default Schedule
