import React, { useState, useCallback } from 'react';
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
  let [regForm] = Form.useForm();
  let [loginForm] = Form.useForm();

  const changeStatusFunc = useCallback((aciton:string) => {
    changeStatus(aciton);
  }, []);

  const handleOk = () => {
    action === 'login' ? login() : register();
  }

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
    
      userClient.login(userInfo, 1, loginType).then((res) => {
      const res2: any = res;
      if(res2.code === 0) {
        jsCookie.set('the_docters_token', res2.data.token, { expires: 30, path: '/' });
        props.loginSuccess(res2.data.user);
        props.toggleModalVisable(false);
        
        message.success({
          content: res2.message,
          duration: 2,
        });

        loginForm.resetFields();
        changeStatus('login')
      } else {
        message.error({
          content: res2.message,
          duration: 2,
        });
      }
    })
    } catch (E) {
      console.log('Failed:', E);
    }
  }

  const register = async () =>  {
    try {
      const values = await regForm.validateFields();
      console.log('Success:', values);
      const {username, password, name, idcard, sex, age, tel, phoneCaptcha} = values;
        userClient.register({
          username,
          password,
          name,
          idcard,
          sex,
          age,
          tel,
          phoneCaptcha
        }).then((res) => {
          const res2: any = res;
          if(res2.code === 0) {
            props.toggleModalVisable(false);
            regForm.resetFields()
            
            message.success({
              content: res2.message,
              duration: 2,
            });
            regForm.resetFields();
            changeStatus('login')
          } else {
            message.error(res2.message);
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
    onCancel={()=> {
      props.toggleModalVisable(false);
      loginForm.resetFields();
      regForm.resetFields();
      changeStatus('login');
    }}
    >
    {
      action === 'login' ? 
      <WrappedLoginForm  form={loginForm} changeStatus={changeStatusFunc} type='patient'></WrappedLoginForm> : 
      <WrappedRegForm form={regForm} changeStatus={changeStatusFunc}></WrappedRegForm>
    }
  </Modal>
  )
}