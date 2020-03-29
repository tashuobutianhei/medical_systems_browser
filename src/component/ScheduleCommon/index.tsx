
import React, { useState, useEffect } from 'react'
import { Table, message } from 'antd';
import moment from 'moment';
import CONST from '../../common/const';
import doctorClient from '../../api/doctor';
import departmentClient from '../../api/department';

import 'antd/dist/antd.css'
import './index.scss'

const initCol = [
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
      if (index === 0 || index%3 === 0) {
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
]
let columns:any[] = [...initCol];

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

type propsType = {
  departmentList: any
  type: String
}

function Schedule (props: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [doctorList, setDctorList] = useState<any[]>([]); // 医生list
  // const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表

    // 获得近六天的list
  const initTableCol = () => {
    columns = [...initCol];
    getScheduleDateList().forEach(item => {
      columns.push({
        title: `${getDateString(item)}-星期${CONST.WEEK_DAY[item.getDay()]}`,
        key: getRouteKey(item),
        dataIndex: getRouteKey(item),
        // eslint-disable-next-line react/display-name
        render: (record: any) => {
          return (
            (<div className='order-table-content-item'>{
              record ? record.map(item => {
                return (
                  <p key={item.doctor.workerId}>{item.doctor.name}</p>
                )
              }): '无' 
            }</div>)
          )
        }
      })
    });
  }

  async function getDoctors(params: any) {
    const res:any =  await doctorClient.getDoctors(params);
    if(res.code === 0) {
    // 医生列表
      setDctorList(res.data);
    }
  }

  async function fetchSchedule () {
    const midArray = [];
    await Promise.all(props.departmentList.map(async department => {
      const res:any =  await doctorClient.getScheduleOfPeriod(department.departmentId);
      if(res.code !== 0) {
        message.error({
          content: '接口错误'
        })
        return;
      }

      [0, 1, 2].forEach(item => {
        const fliterray = res.data.map(it => it[item])
        let obj = {};
        // console.log(fliterray)
        fliterray.forEach(it => {
          if(it === undefined) {
            return {}
          }
          obj[getRouteKey(it.data)] = it.doctors && it.doctors.split(',').map(doctor => {
            return {
              doctor: doctorList.find(doctorItem => doctorItem.workerId === doctor),
              wokrId: it.wokrId
            };
          })
        })
       
        midArray.push({
          key: String(department.departmentId) + item,
          department: department.departmentName,
          time: CONST.WORK_SHIFTS[item],
          ...obj
        })
      })
    }));

    setDataSource(midArray);
  }

  const fetchData = async () => {
    await getDoctors({});
  };

  useEffect(() => {
    if(doctorList.length > 0 &&
      props.departmentList.length > 0 &&
      Object.keys(props.departmentList[0]).length > 0 &&
      props.departmentList[0].departmentId
      ) {
      fetchSchedule();
    }
  }, [doctorList, props.departmentList]);

  useEffect(() => {
    fetchData();
    initTableCol();
  },[]);

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

export default Schedule
