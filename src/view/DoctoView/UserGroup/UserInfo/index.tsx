import React, { useState, useEffect } from 'react'
import { message, Upload, Button, Input, Radio, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { userLogout, userLogin } from '../../../../action/user';
import CONST from '../../../../common/const';
import jsCookie from 'js-cookie';
import userClient from '../../../../api/user';
import departmentClient from '../../../../api/department';

import 'antd/dist/antd.css'
import './index.scss'


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只支持JPG/PNG文件');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片过大，超过2MB!');
  }
  return isJpgOrPng && isLt2M;
}

function User (props: any) {
  const [mode, setMode] = useState<string>('data'); // data/edit两种模式
  const [userInfo, setuserInfo] =  useState<any>({}); 
  const [imageUrl, setImageUrl] = useState<any>('');

  const [passwordCount, setPasswordCount] = useState<number>(0);


  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表
  const [departmentName, setDepartmentName] = useState<string>('');


  const fetchData = async () => {
    const departmentList:any = await departmentClient.getdepartments();
    if(departmentList.code === 0) {
      setDepartmentList(departmentList.data);
    } else {
      message.error({
        content: '服务错误'
      })
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  const check = () => {
    let check = true;
    if (userInfo.password && userInfo.password != '1234567' && passwordCount > 1) {
      if(!userInfo.passwordAgain) {
        check = false;
        message.error({
          content: '请输入密码确认'
        })
      }
      if(userInfo.password != userInfo.passwordAgain) {
        check = false;
        message.error({
          content: '两次密码不一致'
        })
      }
    }

    if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(userInfo.tel))){ 
      message.error({
        content: '手机号码有误，请重填'
      })
      check = false;
    } 
    return check;
  }

  const transform= () => {
    let transform = {};
    userInfo.password && passwordCount > 1 && Object.assign(transform, {
      password:userInfo.password
    });
    userInfo.tel != props.user.tel && Object.assign(transform, {
      tel:userInfo.tel
    });
    userInfo.address != props.user.address && Object.assign(transform, {
      address:userInfo.address
    });
    userInfo.information != props.user.information && Object.assign(transform, {
      information: userInfo.information
    });
    userInfo.university != props.user.university && Object.assign(transform, {
      university: userInfo.university
    });
    imageUrl && Object.assign(transform, {
      avatar: imageUrl
    });
    return transform;
  }

  const update = async () => {
    if(check()) {
      if(Object.keys(transform()).length > 0) {
        const res:any = await userClient.updata({
          ...transform()
        });
        if (res.code === 0) {
          if(Object.keys(transform()).includes('password')) {
            jsCookie.remove('the_docters_token', {path: '/'});
            props.onLogout();
            props.history.push(`/`)
          }
          message.success('修改成功');
          setMode('data');
          reset();
        } else {
          message.error('修改失败');
        }
      } else {
        setMode('data');
        reset();
      }
    }
  };

  const reset = () => {
    setuserInfo({
      ...userInfo,
      password: '',
      passAgain: '',
      tel: props.user.tel,
      address: props.user.address,
    })
    setPasswordCount(0);
    setImageUrl('');
  }

  const onchange = (key, val) => {
    if(key === 'password') {
      // 防止自动填入密码
      let count = passwordCount;
      setPasswordCount(count+1)
    }
    let newObj = {...userInfo};
    newObj[key] = val
    setuserInfo(newObj);
  }

  

  useEffect(() => {
    if(Object.keys(props.user).length > 0) {
      setuserInfo({...props.user, password: '1234567'});
    }
  },[props.user])

  useEffect(() => {
    if(Object.keys(props.user).length > 0 && departmentList.length > 0) {
      setDepartmentName(departmentList.find(item => {
        return userInfo.departmentId == item.departmentId
      }).departmentName)
    }
  }, [departmentList, props.user]);

  return (
    <div>
      <div className="userInfo">
        <div className="userInfo-item">
          <label>工号</label>
          <Input disabled value={userInfo && userInfo.workerId}></Input>
        </div>
        <div className="userInfo-item">
          <label>姓名</label>
          <Input disabled value={userInfo && userInfo.name}></Input>
        </div>
        <div className="userInfo-item">
          <label>身份证号码</label>
          <Input disabled value={userInfo && userInfo.idcard}></Input>
        </div>
        
        <div className="userInfo-item">
          <label>科室</label>
          <Input disabled value={departmentName}></Input>
        </div>
        <div className="userInfo-item">
          <label>职位</label>
          <Input disabled value={CONST.DOCTOR_POSITION[userInfo && userInfo.position]}></Input>
        </div>
        <div className="userInfo-item">
          <label>毕业院校</label>
          <Input disabled={mode === 'data'} value={userInfo && userInfo.university}
           onChange={(e)=>{onchange('university', e.target.value)}}></Input>
        </div>

        <div className="userInfo-item">
          <label>自我介绍</label>
          <Input.TextArea disabled={mode === 'data'} value={userInfo && userInfo.information} 
           onChange={(e)=>{onchange('information', e.target.value)}}/>
        </div>

        <div className="userInfo-item">
          <label>密码</label>
          <Input.Password disabled={mode === 'data'} 
          value={userInfo.password}
          onChange={(e)=>{onchange('password', e.target.value)}}
          />
        </div>
        {
          mode === 'data' ? null :
          <div className="userInfo-item">
            <label>再输一次密码</label>
            <Input.Password disabled={mode === 'data'}
             onChange={(e)=>{onchange('passwordAgain', e.target.value)}}
            ></Input.Password>
          </div>
        } 
        <div className="userInfo-item">
          <label>性别</label>
          <Radio.Group disabled value={userInfo && userInfo.sex}>
            <Radio value={0}>女</Radio>
            <Radio value={1}>男</Radio>
          </Radio.Group>
        </div>
        <div className="userInfo-item">
          <label>电话</label>
          <Input disabled={mode === 'data'} value={userInfo && userInfo.tel}
           onChange={(e)=>{onchange('tel', e.target.value)}}
          ></Input>
        </div>
        <div className="userInfo-item">
          <label>地址</label>
          <Input disabled={mode === 'data'} value={userInfo && userInfo.address}
          onChange={(e)=>{onchange('address', e.target.value)}}></Input>
        </div>
        <div className="userInfo-item">
          <label>头像</label>
          {
            mode === 'data' ?  <Avatar src={userInfo.avatar ? `http://localhost:3000${userInfo.avatar}` : ''} 
            icon={<UserOutlined />}/>  :
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={(params) => {
                getBase64(params.file, imageUrl => {
                  setImageUrl(imageUrl);
                });
              }}
            >     
            
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : 
            <div className="ant-upload-text">上传</div>}
            </Upload>
          }
        </div> 
        {
          mode === 'data' ?  <Button type="primary"
          className="userInfo-button"
          onClick={() => {
            setMode('edit')
          }}>编辑信息</Button> :  
          <Row justify="space-around">
            <Col span="8">
              <Button type="dashed" className="userInfo-button"
              onClick={() => {
                  update();
              }}>确认</Button>
            </Col>
            <Col span="8">
              <Button type="primary" danger
              className="userInfo-button"
              onClick={() => {
                setMode('data');
                reset();
              }}>取消</Button>
            </Col>
          </Row>
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: { user: any; }) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch: (arg0: { type: string; userInfo?: any; }) => void) => {
  return {
    onLogin: (userInfo: any) => {
      dispatch(userLogin(userInfo))
    },
    onLogout: () => {
      dispatch(userLogout())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User) ;