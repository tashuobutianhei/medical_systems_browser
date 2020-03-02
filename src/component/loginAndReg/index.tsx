import React, { useState } from 'react';
import {Modal, message} from 'antd';

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
  let regForm, loginForm: any;

  const changeStatusFunc = (aciton:string) => {
    changeStatus(aciton);
  }

  const handleOk = () => {
    action === 'login' ? login() : register();
  }

  const  login = () => {
    loginForm.validateFields((err: any, values: { username: string; password: string; }) => {
      if(!err) {
        userClient.login(values.username, values.password, 1).then((res) => {
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
        
      }
      
    })
  }

  const register = () =>  {

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
      <WrappedLoginForm  ref={(c)=> loginForm = c } changeStatus={changeStatusFunc}></WrappedLoginForm> : 
      <WrappedRegForm ref={(c)=> regForm = c } changeStatus={changeStatusFunc}></WrappedRegForm>
    }
  </Modal>
  )
}