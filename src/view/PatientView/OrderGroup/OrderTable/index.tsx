import React, { useState, useEffect } from 'react'
import { Table, message } from 'antd';
import moment from 'moment';
import CONST from '../../../../common/const';
import doctorClient from '../../../../api/doctor';

import 'antd/dist/antd.css'
import './index.scss'


const columns:any[] = [
  {
    title: '科室',
    dataIndex: 'department',
    key: 'department',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {
          rowSpan: 1
        },
      };
      if (index === 0) {
        obj.props.rowSpan = 3;
      } else {
        obj.props.rowSpan = 0;
      }
      return obj;
    },
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
];

const getScheduleDateList = () => {
  const ScheduleDateList = [];
  const step = 86400000;
  for (let i = 0; i < 6; i++) {
    const itemDate = new Date(Date.now() + i * step);
    ScheduleDateList.push(new Date(moment(itemDate).format('YYYY-MM-DD')));
  }
  return ScheduleDateList;
}

// 格式化展示的字符
const getDateString = (date: Date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}.${month}.${day}`;
}

// 格式化route/:key
const getRouteKey= (date: Date) => {   
  return moment(date).format('YYYY-MM-DD').split('-').join('');
}


function Order (props: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [doctorList, setDctorList] = useState<any[]>([]); // 医生list

    // 获得近六天的list
  const initTableCol = () => {
    getScheduleDateList().forEach(item => {
      columns.push({
        title: `${getDateString(item)}-星期${CONST.WEEK_DAY[item.getDay()]}`,
        key: getRouteKey(item),
        dataIndex: getRouteKey(item),
        // eslint-disable-next-line react/display-name
        render: (record: any) => {
          console.log(record);
          return (
            (<div className='order-table-content-item'>{
              record ? record.map(item => {
                return (
                  <p key={item.workerId}>{item.name}</p>
                )
              }): '无' 
            }</div>)
          )
        }
      })
    });
  }

  async function getDoctors(params: any) {
    const res:any =  await doctorClient.getDocters(params);
    if(res.code === 0) {
    // 医生列表
      setDctorList(res.data);
    }
  }

  async function fetchSchedule () {
    const res:any =  await doctorClient.getScheduleOfPeriod(props.order.department.departmentId);
    if(res.code !== 0) {
      message.error({
        content: '接口错误'
      })
      return;
    }
    const midArray = [];
    [0, 1, 2].forEach(item => {
      const fliterray = res.data.map(it => it[item])
      let obj = {};
      fliterray.forEach(it => {
        obj[getRouteKey(it.data)] = it.docters && it.docters.split(',').map(doctor => {
          return doctorList.find(doctorItem => doctorItem.workerId === doctor);
        })
      })
     
      midArray.push({
        key: props.order.department.departmentId + item,
        department: props.order.department.departmentName,
        time: CONST.WORK_SHIFTS[item],
        ...obj
      })
    })
    setDataSource(midArray);
  }

  useEffect(() => {
    initTableCol();
  },[]);

  useEffect(() => {
    if(props.order.department) {
      getDoctors({departmentId: props.order.department.departmentId});
    }
  }, [props.order]);

  useEffect(() => {
    if(doctorList.length > 0) {
      fetchSchedule();
    }
  }, [doctorList]);

  return (
    <div className="order-table">
        <p className="order-table-title">科室值班表</p>
        <div className="order-table-content">
          <Table 
          bordered
          dataSource={dataSource} 
          columns={columns} 
          pagination={false}/>
        </div>
        <div className="order-table-footer">
        </div>
    </div>
  )
}

export default Order;