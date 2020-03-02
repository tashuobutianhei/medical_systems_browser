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
    loginForm.validateFields((err: any, values: { username: string; password: string; }) => {
      if(!err) {
        userClient.login(values.username, values.password, props.userType).then((res) => {
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

  return(
    <Modal
    title='快登陆'
    okText='登录'
    cancelText="算了"
    visible={visible}
    onOk={login}
    onCancel={()=> props.toggleModalVisable(false)}
    >
      <WrappedLoginForm  ref={(c)=> loginForm = c }></WrappedLoginForm> : 
  </Modal>
  )
}