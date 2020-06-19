import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Button, Input, Col, Row, message } from 'antd';
import { withRouter } from 'react-router';
import adminClient from '../../../api/admin';
import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'react-quill/dist/quill.snow.css';
import 'antd/dist/antd.css'
import './index.scss'
const xss = require('xss');

const modules =  {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  },
}


const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];


function Text (props: any) {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('data');

  useEffect(() => {
    if(props.match && props.match.params) {
      const textId = props.match.params.textId;
      if (/^create_/.test(textId)) {
        setMode('create');
      } else {
        if(props.data && props.data.Info) {
          const data = props.data.Info;

          let arctle = {
            value: '',
            title: '',
            update: ''
          }
          if(Array.isArray(data.articleInfo)) {
            let midarctle =  data.articleInfo.find(item => {
              return item.textId == textId
            })
            if(midarctle) {
              arctle = midarctle;
            }
          };
          setValue(arctle.value);
          setTitle(arctle.title);
        }
      }
    }
  }, [props]);

  const update = async () => {
    let res:any;
    if (mode === 'create') {
      res = await adminClient.addArtcle({
        value,
        title,
        type: props.match.params.textId.split('_')[1],
      })
    } else if (mode === 'set') {
      res = await adminClient.updateArtcle({
        textId: parseInt(props.match.params.textId),
        value,
        title,
      })
    }

    if(res.code === 0 ) {
      message.success('发布成功')
      setMode('data');
      props.history.push('/Admin/Text');
    } else {
      message.error('发布失败');
    }
  };

  return (
    <div className="adminText-edit">
      <Row className="adminText-edit-title">
        <Col span={1}>
         标题
        </Col>
        <Col span={23}>
          <Input disabled={mode === 'data'} value={title} onChange={(e) => {setTitle(e.target.value)}}></Input>
        </Col>
      </Row>
     
      <ReactQuill 
        theme="snow" 
        value={value} 
        formats={formats}
        className={mode === 'data' ? 'disabled' : ''}
        modules= {modules}
        style={{
          minHeight:'600px',
        }}
        onChange={(e) => {
          setValue(xss(e));
         
        }}/>
      <div className="adminText-edit-button">
        {
          mode === 'data' ? <Button type="primary" onClick={() => {
            setMode('set');
          }}>编辑</Button>:
          <div>
            <Button type="primary" onClick={update}>发布</Button>
            {
              mode === 'set' ?  <Button onClick={() => {
                setMode('data');
              }}>取消</Button> : ''
            }
          </div>
        }
      </div>
    </div>
  );
}

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(withRouter(Text));