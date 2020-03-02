import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox } from 'antd';


import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  changeStatus?: (aciton: string)=> void
  form: any
}

const formItemLayout = {
  wrapperCol: { span: 24 },
};

function LoginForm(props: Props) {
  const { getFieldDecorator } = props.form;
  return (
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
        <div>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <a className="login-form-forgot" href="">
            忘记密码
                  </a>
        </div>
        <div>
          Or <a href="javascript:;" onClick={() => {
            props.changeStatus && props.changeStatus('reg');
          }}>快去注册!</a>
        </div>
      </Form.Item>
    </Form>
  );
}


export const WrappedLoginForm = Form.create<Props>({ name: 'user_login' })(LoginForm);