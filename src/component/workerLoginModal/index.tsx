import React from 'react';
import {Modal, message} from 'antd';

import {WrappedLoginForm} from '../LoginForm/index';

import userClient from '../../api/user';
import jsCookie from 'js-cookie';


import 'antd/dist/antd.css'
import './index.scss'
import { useForm } from 'antd/lib/form/util';

type Props = {
  userType: number
  visible: boolean
  toggleModalVisable: (visable:boolean) => void;
  loginSuccess: (UserInfo: any) => void
}


export function LoginModal(props: Props) {
  let visible = props.visible;
  let [loginForm] = useForm();

  const  login = async () => {
    try {
      const values = await loginForm.validateFields();

      let userInfo: any = {};
      let loginType = 0;
      if (values.tel) {
        userInfo = {
          tel: values.tel,
          loginPhoneCaptcha: values.phoneCaptcha
        }
        loginType = 1;
      } else {
        userInfo = {
          username: values.username,
          password: values.password,
          captcha: values.captcha
        }
      }
    
      userClient.login(userInfo, props.userType, loginType).then((res) => {
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
    } catch(e) {
      console.log(e);
    }
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
      <WrappedLoginForm  form={loginForm} type='worker'></WrappedLoginForm>
  </Modal>
  )
}