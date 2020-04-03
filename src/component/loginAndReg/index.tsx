import React, { useState } from 'react';
import {Modal, message, Form} from 'antd';

import {WrappedLoginForm} from '../LoginForm/index';
import {WrappedRegForm} from '../registerForm'

import userClient from '../../api/user';
import jsCookie from 'js-cookie';

import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  visible: boolean
  toggleModalVisable: (visable:boolean) => void;
  loginSuccess: (UserInfo: any) => void
}


export function LoginRegModal(props: Props) {
  let [action,changeStatus]  = useState<string>('login');
  let visible = props.visible;
  let loginForm: any;
  let [regForm] = Form.useForm();

  const changeStatusFunc = (aciton:string) => {
    changeStatus(aciton);
  }

  const handleOk = () => {
    action === 'login' ? login() : register();
  }

  const  login = () => {
    loginForm.validateFields((err: any, values: { username: string; password: string; captcha: string | number }) => {
      if(!err) {
        // console.log()
        userClient.login({
            username: values.username,
            password: values.password,
            captcha: values.captcha
          }, 1, 0).then((res) => {
          const res2: any = res;
          if(res2.code === 0) {
            jsCookie.set('the_docters_token', res2.data.token, { expires: 30, path: '/' });
            props.loginSuccess(res2.data.user);
            props.toggleModalVisable(false);
            
            message.success({
              content: res2.message,
              duration: 2,
            });
          } else {
            message.error({
              content: res2.message,
              duration: 2,
            });
          }
        })
      } else {
        message.error({
          content: '信息不完善'
        })
      }
    })
  }

  const register = async () =>  {
    try {
      const values = await regForm.validateFields();
      console.log('Success:', values);
      const {username, password, name, idcard, sex, age, tel} = values;
        userClient.register({
          username,
          password,
          name,
          idcard,
          sex,
          age,
          tel
        }).then((res) => {
          const res2: any = res;
          if(res2.code === 0) {
            props.toggleModalVisable(false);
            regForm.resetFields()
            
            message.success({
              content: res2.message,
              duration: 2,
            });
          } else {
            message.error({
              content: res2.message,
              duration: 2,
            });
          }
        })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return(
    <Modal
    title={`快！${action === 'login' ? '登录' : '注册'}！`}
    okText={`${action === 'login' ? '登录' : '注册'}！`}
    cancelText="算了"
    visible={visible}
    onOk={handleOk}
    onCancel={()=> props.toggleModalVisable(false)}
    >
    {
      action === 'login' ? 
      <WrappedLoginForm  ref={(c)=> loginForm = c } changeStatus={changeStatusFunc} type='patient'></WrappedLoginForm> : 
      <WrappedRegForm form={regForm} changeStatus={changeStatusFunc}></WrappedRegForm>
    }
  </Modal>
  )
}