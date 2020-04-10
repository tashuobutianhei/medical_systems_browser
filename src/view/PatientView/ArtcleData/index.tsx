import React, { useState, useEffect } from 'react';
import { Button, Input, Col, Row, message, Breadcrumb } from 'antd';
import { withRouter } from 'react-router';
import adminClient from '../../../api/admin';
import monent from 'moment';

import 'react-quill/dist/quill.snow.css';
import 'antd/dist/antd.css'
import './index.scss'

function Text (props: any) {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [updata, setUpdata] = useState('');

  const fetchData = async (textId: string) => {
    const res:any = await adminClient.findArtcle();
      if(res.code === 0) {
        const arctle = res.data.find(item => {
          return item.textId == textId
        })
        setValue(arctle.value);
        setTitle(arctle.title);
        setUpdata(arctle.updata)
      } else {
        message.error('服务错误');
      }
  }

  useEffect(() => {
    if(props.match && props.match.params) {
      const textId = props.match.params.textId;

      fetchData(textId); 
      
    }
  }, [props]);

  return (
    <>
      <div className="actcleData">
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <span onClick={() => {
              props.history.push(`/Patient/Atrcle/`)
            }}>医院公告</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>

        <h2  className="actcleData-title">{title}</h2>
        <div 
          className="actcleData-value"
          dangerouslySetInnerHTML={{ __html:  value }}>
        </div>
        <span  className="actcleData-update">
          更新日期：{monent(updata).format('YYYY-MM-DD')}
        </span>
      </div>
    </>
  );
}

export default withRouter(Text);