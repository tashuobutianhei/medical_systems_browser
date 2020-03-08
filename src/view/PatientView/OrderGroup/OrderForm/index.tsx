import React, { useState, useEffect, useRef } from 'react'
import { Button, message, Input, Form, Checkbox ,Switch,DatePicker, Modal } from 'antd';

import 'antd/dist/antd.css'
import './index.scss'
import orderClient from '../../../../api/order';

const {TextArea} = Input;
function Order (props: any) {

  const [count, setcount] = useState<number>(0);
  const [switchVal, setSwitch] = useState<boolean>(false);
  const intRef = useRef<any>();

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  useEffect(()=>{
    if(count === 5) {
      Modal.success({
        content:(
          <div>
            <p>挂号已经成功，请您按找相应的时间前往医院就诊</p>
            <p>{count}s后将返回首页</p>
          </div>
        ) 
      });
    }
    let mid = count;
    let id = setInterval(()=> {
      setcount(--mid);
      if(mid === 0) {
        window.location.href = '/Patient';
      } 
    }, 1000);
    intRef.current = id;
  
    return () => {
      if(intRef.current ) {
        clearInterval(intRef.current )
      }
    }
  }, [count])

  const onFinish = async (val) => {
    const res:any = await orderClient.orderInfo({
      caseId : props.order.caseId,
      ...val
    });

    if(res.code === 0) {
      setcount(5);
    } else {
      message.error({
        content: '500: 服务出错'
      })
    }
  }



  return (
    <div className="order-form">
        <p className="order-fom-title"></p>
        <p>请尽可能的填写病情，描述自身身体状况，以便于医生可以获得更多的了解关于您的病情（涉及方面可有：发病时间，症状，自身经历，是否吃过其他药物，是否有其他就医经历）</p>
        {count}
        <div className="order-form-content">
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            <Form.Item label="发病时间" name="time">
              <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item label="症状" name="status">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label="经历" name="todo">
              <Input />
            </Form.Item>
            <Form.Item label="服用药物" name="medicine">
            <Input />
            </Form.Item>
            <Form.Item label="注意事项" name="attention">
              <Input />
            </Form.Item>
            <Form.Item label="是否就医" name="hospital">
              <Switch onChange={(val) => {
                setSwitch(val)
              }}/>
            </Form.Item>
            {
              switchVal ?  <Form.Item label="诊断结果" name="result">
              <Input />
            </Form.Item> : null
            }
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
        </div>
    </div>
  );
}

export default Order;