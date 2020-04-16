import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, message, Row, Col, Form, Tabs, Button } from 'antd';
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
  const [cap, setCap] = useState<any>('');

  const [second, setSecond] = useState<number>(60);
  const [disabledCap, setDisabledCap] = useState<boolean>(false);
  const [loginType, setLoginType] = useState('password');

  useEffect(() => {
    let id; 
    if (disabledCap) {
      let a = 60;
      const id = setInterval(() => {
          a--;
          if (a === 0) {
            clearInterval(id);
            setDisabledCap(false);
            a = 60;
          }
          setSecond(a);
        }, 1000);
    } else {
      clearInterval(id);
      setSecond(60);
    }
  }, [disabledCap]);

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
    <Form className="login-form" form={props.form} {...formItemLayout}>
      <Tabs defaultActiveKey="password" onChange={(e => {
        props.form.resetFields();
        setLoginType(e);
      })}>
        <Tabs.TabPane tab="用户名密码" key="password">
          <Form.Item 
            name="username"  
            rules={[({ getFieldValue }) => ({
              async validator(rule, value) {
                if(value || loginType === 'tel') {
                  return Promise.resolve();
                } 
                return Promise.reject('请输入用户名');
                
              }
            })]}>
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
          </Form.Item>
          <Form.Item name="password" rules={[({ getFieldValue }) => ({
              async validator(rule, value) {
                if(value || loginType === 'tel') {
                  return Promise.resolve();
                } 
                return Promise.reject('请输入密码');
                
              }
            })]}>
              <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
          </Form.Item>
          <Form.Item name="captcha" rules={[({ getFieldValue }) => ({
              async validator(rule, value) {
                if(value || loginType === 'tel') {
                  return Promise.resolve();
                } 
                return Promise.reject('验证码');
                
              }
            })]}>
              <Row justify="space-between">
                <Col span="18">
                <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="验证码"
                />
                </Col>
                <Col  span="4">
                  <img className="login-cap" alt="验证码" src={cap} onClick={() => {
                    fetchCap();
                  }}></img>
                </Col>
              </Row>
          </Form.Item>
        </Tabs.TabPane>
        {
          props.type === 'patient' ? <Tabs.TabPane tab="短信验证码" key="tel">
          <Form.Item name="tel" hasFeedback
            rules={[({ getFieldValue }) => ({
              async validator(rule, value) {
                if((/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) || loginType === 'password') {
                  return Promise.resolve();
                } 
                return Promise.reject('请输入正确手机号');
              }
            })]}>
              <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="输入手机号"
              />
          </Form.Item>
          <Form.Item name="phoneCaptcha" rules={[{required: true, message: '请输入验证码'}]}>
            <Row justify="space-between">
              <Col span="17">
                <Input  placeholder="输入验证码"/>
              </Col>
              <Col >
                <Button 
                disabled={disabledCap}
                onClick={async () => {
                  if(!props.form.getFieldValue('tel')) {
                    message.error('输入手机号');
                    return;
                  }
                  const res:any = await userClient.getPhone({
                    type: 'login',
                    mobile: props.form.getFieldValue('tel')
                  });
                  if(res.code === 0) {
                    setDisabledCap(true)
                  } else {
                    message.error('短信发送失败');
                  }
                }}>{ disabledCap ? `(${second}s)后重新发送` :
                "获取验证码"
                }</Button>
              </Col>
            </Row>
          </Form.Item>
        </Tabs.TabPane>: null
        }
      </Tabs>
      <Form.Item>
        {
          props.type === 'worker' ? null : 
          <div>
          <a className="login-form-forgot" href="">
            忘记密码
          </a> Or <a onClick={() => {
            props.changeStatus && props.changeStatus('reg');
          }}>快去注册!</a>
        </div>
        }
      </Form.Item>
    </Form>
    </>
  )
}


export const WrappedLoginForm = LoginForm;