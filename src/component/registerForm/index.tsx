import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Divider, Radio, InputNumber } from 'antd';


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
  const { getFieldDecorator } = props.form;
  return (
    <Form className="login-form" {...formItemLayout}>
    <Form.Item>
      {getFieldDecorator('username', {
        rules: [{ required: true, message: '请输入一个用户名作为登陆使用' }],
      })(
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="请输入一个用户名作为登陆使用，不可更改哦"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('password', {
        rules: [{ required: true, message: '请输入密码,不然咋登录' }],
      })(
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('passwordAgain', {
        rules: [{ required: true, message: '请输入密码呀!不然咋登录' }],
      })(
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="重复输入密码"
        />,
      )}
    </Form.Item>
    <div>
      <Divider>个人信息采集</Divider>
      <p>挂号服务需要实名制，请准确填写，不然将会影响后续的服务</p>
    </div>    
    <Form.Item>
      {getFieldDecorator('name', {
        rules: [{ required: true, message: '请填写姓名' }],
      })(
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="请输入您的姓名"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('idcard', {
        rules: [{ required: true, message: '请填写正确的身份证号' }],
      })(
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="输入身份证"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('tel', {
        rules: [{ required: true, message: '请输入正确手机号' }],
      })(
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="输入手机号"
        />,
      )}
    </Form.Item>
    <Form.Item label="性别" wrapperCol={{ span: 12}}>
      {getFieldDecorator('sex', {
        rules: [{ required: true, message: '选择性别' }],
      })(
        <Radio.Group >
          <Radio value={0}>女</Radio>
          <Radio value={1}>男</Radio>
        </Radio.Group>
      )}
    </Form.Item>
    <Form.Item label="年龄" wrapperCol={{ span: 12}}> 
      {getFieldDecorator('age', {
        rules: [{ required: true, message: '输入年龄' }],
      })(
        <InputNumber min={0} max={120} defaultValue={3}/>
      )}
    </Form.Item>
    <Form.Item>
      <div>
        Or <a href="javascript:;" onClick={() => {
            props.changeStatus('login');
          }}>快去登录!</a>
      </div>
    </Form.Item>
  </Form>
  );
}

export const WrappedRegForm = Form.create<Props>({ name: 'user_reg' })(RegForm);