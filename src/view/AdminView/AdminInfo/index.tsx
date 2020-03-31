import React, { useState, useEffect } from 'react'
import { Tabs, message, Upload, Badge, Button } from 'antd';
import adminClient from '../../../api/admin';
import './index.scss';
const { TabPane } = Tabs;

const AdminInfo = () => { 
  
  const [mode, setMode] = useState<any>({
    home: 'data',
    examination: 'data',
    doctor: 'data',
    order: 'data'
  });
  const [tab, setTab] = useState<any>('home');

  const [fileList, setFileList] = useState<any>([]);
  
  const [info, setInfo] = useState<{
    id: Number
    carousel: String | null
    order: String | null
    doctor: String | null
  }>({
    id: 0,
    carousel: null,
    order: null,
    doctor: null
  });

  useEffect(() => {
    const fetch = async () => {
      const res: any = await adminClient.getCommonInfo();
      if(res.code === 0) {
        setInfo(res.data);
        initImg(res.data.carousel);
      } else {
        message.error('数据错误')
      }
    }
    fetch();
  },[]);

  function initImg(img) {
    const aaa = img.split(',').map((item, index) => {
      return {
        uid: `store-${index}`,
        name: item,
        status: 'done',
        url: `http://localhost:3000${item}`,
        thumbUrl: `http://localhost:3000${item}`,
      }
    })
    setFileList(aaa) 
  };

  function onchangeCallback(key) {
    setTab(key);
    setMode({
      home: 'data',
      examination: 'data',
      doctor: 'data',
      order: 'data'
    })
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

  const updateClient = async (data) => {
    const res:any = await adminClient.updateCommonInfo(data)
    if(res.code === 0) {
      message.success('编辑成功');
      let obj = {...mode};
      obj[tab] = 'data'
      setMode({
        ...obj
      });
    } else {
      message.error('编辑失败');
    }
  }

  const update = () => {
    switch (tab) {
      case 'home':
        updateClient({
          type: 'carousel',
          data: JSON.stringify(fileList)
        })
        break;
    
      default:
        break;
    }

  }


  return (
    <div className="adminInfo">
      <Tabs type="line" 
      defaultActiveKey='home'
      onChange={onchangeCallback}
      >
        <TabPane tab="主页信息" key="home">
          <h3>首页轮播图</h3>
          {
            mode['home'] === 'data' ? 
            <Upload
            fileList={fileList}
            listType="picture-card"
            className="avatar-uploader"
          ></Upload> : 
            <Upload
              fileList={fileList}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              beforeUpload={beforeUpload}
              onChange={(params) => {
                console.log(params);
                setFileList(params.fileList);
              }}
            >     
            <div className="ant-upload-text">上传</div>
            </Upload>  
          }
        </TabPane>
        <TabPane tab="检查项目" key="examination">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="就医须知" key="doctor">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="挂号须知" key="order">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
      {
        mode[tab] === 'data' ? 
        <Button onClick={() => {
          let obj = {...mode};
          obj[tab] = 'edit'
          setMode({
            ...obj
          });
        }}>编辑</Button> 
        : <Button onClick={update}>保存</Button> 
      }
           
    </div>
  )
}

export default AdminInfo;