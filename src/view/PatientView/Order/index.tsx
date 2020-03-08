import React, { useState } from 'react'
import { Steps, Divider, message } from 'antd';

import OrderRead from '../OrderGroup/OrderRead';
import OrderDepartment from '../OrderGroup/OrderDepartment';
import OrderTable from '../OrderGroup/OrderTable';
import OrderForm from '../OrderGroup/OrderForm';

import 'antd/dist/antd.css'
import './index.scss'
import { connect } from 'react-redux';

const { Step } = Steps;

const StepList = [
  {
    key: 0,
    title: '挂号协议',
    description: '请先确认《挂号协议》',
  },
  {
    key: 1,
    title: '选择科室',
    description: '选择合适的科室进行挂号',
  },
  {
    key: 2,
    title: '挂号选择',
    description: '选择合适的时间和医生',
  },{
    key: 3,
    title: '信息完善',
    description: '完善病例',
  }
]

function Order (props: any) {
  const [current, setScurrent] = useState<number>(0);
  const [order, setOrder] = useState<any>({})

  const nextStep = (params: any) => {
    if(!(props.user && props.type === 0)) {
      message.error({
        content: '挂号请先登陆'
      })
      return;
    }
    let cur = current;
    setScurrent(++cur);
    if(typeof params === 'object' && Object.keys(params).length > 0) {
      setOrder({
        ...order,
        ...params
      })
    }
  }

  return (
    <div className="order">
        <Divider>{StepList.find(item => item.key === current).title}</Divider>

        <Steps className='order-step' current={current} onChange={(cur) => {
          // setScurrent(cur);
        }} direction="vertical">
          {
            StepList.map(item =>  
            <Step title={item.title} description={item.description} key={item.key}/>
            )
          }
        </Steps>

        <div className='order-content'>
          {
            current == 0 ? <OrderRead nextStep={nextStep}></OrderRead> : null
          }
          {
            current == 1 ? <OrderDepartment nextStep={nextStep}></OrderDepartment> : null
          }
          {
            current == 2 ? <OrderTable nextStep={nextStep} order={order}></OrderTable> : null
          }
          {
            current == 3 ? <OrderForm nextStep={nextStep} order={order}></OrderForm> : null
          }
        </div>
    </div>
  );
}

export default connect(
  (state: { user: any; }) => {
    return {
      user: state.user
    }
  }
)(Order);
