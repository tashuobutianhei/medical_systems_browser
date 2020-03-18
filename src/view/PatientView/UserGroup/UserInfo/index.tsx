import React, { useState, useEffect } from 'react'
import { message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import userClient from '../../../../api/user';

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

function User () {
  // const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>('');

  const update = () => {
    userClient.updata({
      avatar: imageUrl
    });
  };

  return (
    <div>
      <Upload
      name="avatar"
      listType="text"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={(params) => {
        getBase64(params.file, imageUrl => {
          console.log(imageUrl);
          setImageUrl(imageUrl);
        });
      }}
    >
      <Button>
        <UploadOutlined /> 点击上传
      </Button>
    </Upload>
    <Button onClick={update}>确认</Button>
    </div>
  );
}

export default User;