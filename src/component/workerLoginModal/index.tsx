import React from 'react';
import {Modal, message} from 'antd';

import {WrappedLoginForm} from '../LoginForm/index';

import userClient from '../../api/user';
import jsCookie from 'js-cookie';


import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  userType: number
  visible: boolean
  toggleModalVisable: (visable:boolean) => void;
  loginSuccess: (UserInfo: any) => void
}


export function LoginModal(props: Props) {
  let visible = props.visible;
  let loginForm: any;

  const  login = () => {
    loginForm.validateFields((err: any, values: { username: string; password: string; captcha: string | number }) => {
      if(!err) {
        userClient.login({
          username: values.username,
          password: values.password,
          captcha: values.captcha
        }, props.userType, 0).then((res) => {
          const res2: any = res;
          if(res2.code === 0) {
            jsCookie.set('the_docters_token', res2.data.token, { expires: 30, path: '/' });
            props.toggleModalVisable(false);
            props.loginSuccess(res2.data.user);
            
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
          content: '登陆失败',
          duration: 2,
        });
      }
      
    })
  }

  return(
    <Modal
    title='快登陆'
    okText='登录'
    cancelText="算了"
    visible={visible}
    onOk={login}
    onCancel={()=> props.toggleModalVisable(false)}
    >
      <WrappedLoginForm  ref={(c)=> loginForm = c } type='worker'></WrappedLoginForm>
  </Modal>
  )
}