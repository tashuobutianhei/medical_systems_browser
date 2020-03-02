import React, { useState } from 'react';
import {Button} from 'antd';


import 'antd/dist/antd.css';
import './index.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogin } from '../../actiosn/user';
import { LoginModal } from '../workerLoginModal';

type Props = {
  color: string
  imgUrl: string
  enterText: string
  textColor: string
  auth: boolean
  type: number
	path: string
	user: any
}

function HomeEnterCrad(props: Props & RouteComponentProps & RouteComponentProps) {
	let [LoginModalVisable, changLoginModalVisable] = useState<boolean>(false);
	let imgUrl = `/img/${props.imgUrl}.png`;

  const toggleModalVisable = (visable: boolean) => {
    changLoginModalVisable(visable);
  }

  const loginSuccess = (UserInfo: any) => {

  }

  const enterCallback = () => {
		// 需要鉴权
		if (props.auth) {
			const userInfo = props.user;
			if (userInfo && userInfo.type === props.type) {
				// 已登陆，权限正确
				props.history.push(`/${props.path}`)
			} else {
				toggleModalVisable(true);
			}
		} else {
			props.history.push(`/${props.path}`)
		}
  }

	return (
		<>
		<div className="homeentercrad" style={{backgroundColor: props.color}}>
			<div className="homeentercrad-body">
				<img src={imgUrl}></img>
				<span className="homeentercrad-body-text" 
					style={{color: props.textColor}}>{props.enterText}</span>
				<Button className="homeentercrad-body-button" 
					onClick={enterCallback}
					style={{color: props.textColor, backgroundColor: props.color}}>点击进入</Button>
			</div>
		</div>
		<LoginModal 
		userType={props.type}
		visible={LoginModalVisable} 
    toggleModalVisable={toggleModalVisable} 
    loginSuccess={loginSuccess}></LoginModal>
		</>
	);
}

export default withRouter(
  connect(
    (state: { user: any; }) => {
      return {
        user: state.user
      }
    },
    (dispatch: (arg0: { type: string; userInfo?: any; }) => void) => {
      return {
        onLogin: (userInfo: any) => {
          dispatch(userLogin(userInfo))
        }
      }
    },
  )(HomeEnterCrad)
);
