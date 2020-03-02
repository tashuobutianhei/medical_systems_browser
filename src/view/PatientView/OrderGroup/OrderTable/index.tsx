import React, { useState, useEffect } from 'react'
import { Table } from 'antd';
import moment from 'moment';
import CONS from '../../../../common/const';
import departmentClient from '../../../../api/department';

import 'antd/dist/antd.css'
import './index.scss'

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
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
      if (index === 1) {
        obj.props.rowSpan = 2;
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
    // 获得近六天的list
  const initTableCol = () => {
    getScheduleDateList().forEach(item => {
      columns.push({
        title: `${getDateString(item)}-星期${CONS.WEEK_DAY[item.getDay()]}`,
        key: getRouteKey(item),
        dataIndex: getRouteKey(item)
      })
    })
  }

  async function fetchDeparment () {
    const res: any = await departmentClient.getdepartments();
    if (res.code === 0) {
      if(Array.isArray(res.data)) {
        let department = res.data.find(item => item.departmentId == props.order.departmentId);
        if (department) {

        }
      }
    }
  }

  useEffect(() => {
    initTableCol();
  },[]);

  useEffect(() => {
    if(props.order.departmentId) {
      fetchDeparment()
    }
  }, [props.order]);

  return (
    <div className="order-table">
        <p className="order-table-title">科室值班表</p>
        <div className="order-table-content">
          <Table dataSource={dataSource} columns={columns} pagination={false}/>
        </div>
        <div className="order-table-footer">
        </div>
    </div>
  )
}

export default Order;