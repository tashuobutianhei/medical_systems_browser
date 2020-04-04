import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import userClient from '../../api/user';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Divider, Radio, InputNumber, message, Button, Col, Row } from 'antd';


import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  changeStatus: (action:string) => void
  form: any
}

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 24 },
};

function RegForm(props:Props) {
  const [second, setSecond] = useState<number>(60);
  const [disabledCap, setDisabledCap] = useState<boolean>(false);

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

  return (
    <Form form={props.form} className="login-form" {...formItemLayout}>
    <Form.Item 
      name="username" 
      hasFeedback
      rules={[
        { required: true, message: '请输入一个用户名作为登陆使用' },
        ({ getFieldValue }) => ({
          async validator(rule, value) {
            const res: any = await userClient.checkUserInfo({key:'username', value:value});
            if(res.code === 0) {
              if(res.data !== null) {
                return Promise.reject('用户名已经被注册');
              }  
              return Promise.resolve();
            } else {
              message.error('服务错误');
              return Promise.reject('服务错误');
            }
          }
        })]}>
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="请输入一个用户名作为登陆使用，不可更改哦"
        />
    </Form.Item>
    <Form.Item 
      name="password" 
      hasFeedback
      rules={[{ required: true, message: '请输入密码,不然咋登录' },
      ({ getFieldValue }) => ({
        async validator(rule, value) {
          if(value.length < 6) {
            return Promise.reject('密码不够六位');
          }
          if(!/^\w{5,17}$/.test(value)) {
            return Promise.reject('长度在6-18之间，只能包含字符、数字和下划线');
          } 
          return Promise.resolve();
        }
      })]}>
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
        />
    </Form.Item>
    <Form.Item 
      name="passwordAgain" 
      hasFeedback
      dependencies={['password']}
      rules={[
        { required: true, message: '请再输入一遍密码哦' },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject('两次的密码需要一致');
          }
        })]}>
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="重复输入密码"
        />
    </Form.Item>
    <div>
      <Divider>个人信息采集</Divider>
      <p>挂号服务需要实名制，请准确填写，不然将会影响后续的服务</p>
    </div>    
    <Form.Item name="name" rules={[{ required: true, message: '请填写姓名' }]} hasFeedback>
      <Input
        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder="请输入您的姓名"
      />
    </Form.Item>
    <Form.Item name="idcard" 
      rules={[{ required: true, message: '请填写正确的身份证号' },  
      ({ getFieldValue }) => ({
        async validator(rule, value) {
          if(!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
            return Promise.reject('身份证格式错误');
          } 
          return Promise.resolve();
        }
      }),({ getFieldValue }) => ({
        async validator(rule, value) {
          const res: any = await userClient.checkUserInfo({key:'idcard', value: value});
          if(res.code === 0) {
            if(res.data !== null) {
              return Promise.reject('身份证已经被注册');
            }  
            return Promise.resolve();
          } else {
            message.error('服务错误');
            return Promise.reject('服务错误');
          }
        }
      })]} 
      hasFeedback> 
      <Input
        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder="输入身份证"
      />
    </Form.Item>
    <Form.Item name="tel" hasFeedback
      rules={[{ required: true, message: '请输入正确手机号' }, ({ getFieldValue }) => ({
        async validator(rule, value) {
          if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
            return Promise.reject('请输入正确手机号');
          } 
          const res: any = await userClient.checkUserInfo({key:'tel', value:value});
          if(res.code === 0) {
            if(res.data !== null) {
              return Promise.reject('该手机已经被注册');
            }  
            return Promise.resolve();
          } else {
            message.error('服务错误');
            return Promise.reject('服务错误');
          }
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
              type: 'reg',
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
    <Form.Item label="性别" wrapperCol={{ span: 12}} name="sex" hasFeedback
    rules={[{ required: true, message: '选择性别' }]}>
        <Radio.Group >
          <Radio value={0}>女</Radio>
          <Radio value={1}>男</Radio>
        </Radio.Group>
    </Form.Item>
    <Form.Item label="年龄" wrapperCol={{ span: 12}} name="age"  hasFeedback
    rules={[{ required: true, message: '输入年龄' }]}> 
        <InputNumber min={0} max={120} defaultValue={3}/>
    </Form.Item>
    <Form.Item>
      <div>
        Or <a onClick={() => {
            props.changeStatus('login');
          }}>快去登录!</a>
      </div>
    </Form.Item>
  </Form>
  );
}

export const WrappedRegForm = RegForm;