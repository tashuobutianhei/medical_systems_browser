import React, { useState, useEffect } from 'react';
import { Button, Input, Col, Row, message, Breadcrumb } from 'antd';
import { withRouter } from 'react-router';
import monent from 'moment';
import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'react-quill/dist/quill.snow.css';
import 'antd/dist/antd.css'
import './index.scss'

function Text (props: any) {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [updata, setUpdata] = useState('');


  useEffect(() => {
    if(props.match && props.match.params) {
      const textId = props.match.params.textId;

      if(props.data && props.data.Info) {
        const data = props.data.Info;

        let arctle = {
          value: '',
          title: '',
          update: ''
        }
        if(Array.isArray(data.articleInfo)) {
          arctle =  data.articleInfo.find(item => {
            return item.textId == textId
          })
        };
        setValue(arctle.value);
        setTitle(arctle.title);
        setUpdata(arctle.update)
      }
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

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(withRouter(Text));