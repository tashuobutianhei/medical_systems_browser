import React, { useState, useEffect } from 'react'
import { Table, message } from 'antd';
import moment from 'moment';
import CONST from '../../../../common/const';
import doctorClient from '../../../../api/doctor';
import OrderModal from '../../../../component/OrderModal';

import 'antd/dist/antd.css'
import './index.scss'

type order =  {
  departmentId?: string | number
  workerId?: string
  wokrId?: string
  doctorInfo?: any
}

const initColumns = [
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
let columns:any[] = initColumns;


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

  const [visable, setvisable] = useState<boolean>(false);
  const [order, setOrder] = useState<order>({})
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [doctorList, setDctorList] = useState<any[]>([]); // 医生list

  const orderHandle = (params: order) => {
    setOrder(params);
    setvisable(true);
  }

  const nextStep = (caseId: string) => {
    props.nextStep({
      'caseId': caseId
    });
  }

    // 获得近六天的list
  const initTableCol = () => {
    columns = initColumns;
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
                  <p key={item.doctor.workerId} onClick={() => {
                    orderHandle({
                      departmentId: props.order.department.departmentId,
                      workerId: item.doctor.workerId,
                      wokrId: item.wokrId,
                      doctorInfo: item.doctor
                    })
                  }}>{item.doctor.name}</p>
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
        <OrderModal 
        visabley={visable} 
        setvisable={setvisable} 
        orderInfo={order}
        nextStepFuc={nextStep} ></OrderModal>
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