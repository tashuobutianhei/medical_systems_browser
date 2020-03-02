import React, { useState } from 'react'
import { Button, Checkbox, message } from 'antd';


import 'antd/dist/antd.css'
import './index.scss'

function Order (props: any) {
  const [readStatus, setReadStauts] = useState<boolean>(false);

  const onclickButton = () => {
    if (!readStatus) {
      message.error({
        content: '请确认阅读挂号协议',
        duration: 2
      })
    } else {
      props.nextStep();
    }
  }

  return (
    <div className="order-read">
        <p className="order-read-title">挂号协议</p>
        <p className="order-read-content">这是挂号协议的内容 TODO这是挂号协议的内容 
          TODO这是挂号协议的内容 TODO这是挂号协议的内容 
          TODO这是挂号协议的内容 TODO这是挂号协议的内容 
          TODO这是挂号协议的内容 TODO这是挂号协议的内容 TODO这是挂号协议的内容 TODO这是挂号协
          议的内容 TODO这是挂号协议的内容 TODO这是挂号协议的内容 TODO</p>

        <div className="order-read-footer">
          <Checkbox checked={readStatus} onChange={(e) => {
            setReadStauts(e.target.checked)
          }}>我已经阅读《挂号协议》,并同意内容</Checkbox>
          <Button type="primary" 
          className="order-read-footer-button" 
          onClick={onclickButton}>确认协议</Button>
        </div>
    </div>
  );
}

export default Order;