import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import { Input, Checkbox, message, Row, Col } from 'antd';
import userClient from '../../api/user'

import '@ant-design/compatible/assets/index.css';

import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  changeStatus?: (aciton: string)=> void
  form: any,
  type?: string
}

const formItemLayout = {
  wrapperCol: { span: 24 },
};

function LoginForm(props: Props) {
  const { getFieldDecorator } = props.form;
  const [cap, setCap] = useState<any>('');

  const fetchCap = async () => {
    const res:any = await userClient.getcaptcha();
    if(res.code === 0) {
     setCap(res.cap);
    } else {
      message.error('验证码获取失败');
    }
  }

  useEffect(() => {
   fetchCap();
  }, []);
  
  return (
    <>
    <Form className="login-form" {...formItemLayout}>
     
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '至少得告诉我你叫啥呀？!' }],
        })(
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户名"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码呀!不然咋登录' }],
        })(
          <Input
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('captcha', {
          rules: [{ required: true, message: '请输入验证码' }],
        })(
          <Row justify="space-between">
            <Col span="18">
            <Input
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="验证码"
            />
            </Col>
            <Col  span="4">
              <img className="login-cap" src={cap} onClick={() => {
                fetchCap();
              }}></img>
            </Col>
          </Row>
        )}
      </Form.Item>
      <Form.Item>
        <div>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <a className="login-form-forgot" href="">
            忘记密码
          </a>
        </div>
        {
          props.type === 'worker' ? null : 
          <div>
          Or <a onClick={() => {
            props.changeStatus && props.changeStatus('reg');
          }}>快去注册!</a>
        </div>
        }
      </Form.Item>
    </Form>
    </>
  )
}


export const WrappedLoginForm = Form.create<Props>({ name: 'user_login' })(LoginForm);