import React, { useState, useEffect } from 'react'
// import { DownOutlined, UserOutlined, ReadFilled } from '@ant-design/icons';
import { Avatar, Tabs, List, Button, message } from 'antd';
import { withRouter } from 'react-router-dom'
import adminClient from '../../../api/admin';
import moment from 'moment';

import 'antd/dist/antd.css'
import './index.scss'

const { TabPane } = Tabs;

type artcle = {
  title: string,
  update: string
  textId: number
};

function Text (props: any) {

  const [artcleList0, setArtcleList0] = useState<artcle[]>([]);
  const [artcleList1, setArtcleList1] = useState<artcle[]>([]);

  const onchangeCallback = () => {
    
  }

  const fetch = async () => {
    const res:any = await adminClient.findArtcle();
    const array0 = [];
    const array1 = [];
    if(res.code === 0) {
      res.data.forEach(item => {
        if(item.type == 0) {
          array0.unshift(item);
        } else {
          array1.unshift(item);
        }
      });
      setArtcleList0(array0);
      setArtcleList1(array1);
    } else {
      message.error('服务错误哦');
    }
  }

  const destroy = async (textId: number) => {
    const res:any = await adminClient.deleteArtcle({textId});

    if(res.code === 0) {
      message.success('删除成功');
      await fetch();
    } else {
      message.error('服务错误哦');
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return <>
  <Tabs 
    type="line" 
    className="adminText"
    defaultActiveKey='active'
    onChange={onchangeCallback}>
      <TabPane tab="医院动态" key="active">
         <Button type="primary" onClick={() => {
            props.history.push(`/Admin/TextEdit/create_0`)
         }}>发布动态</Button>
         <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={artcleList0}
          renderItem={(item,index) => (
              <List.Item
                actions={[
                <a key="list-loadmore-edit" onClick={() => {
                  props.history.push(`/Admin/TextEdit/${item.textId}`)
                }}>编辑</a>,
                <a key="list-loadmore-more" style={{'color': 'red'}} onClick={() => {
                  destroy(item.textId)
                }}>删除</a>]}
              >
                  <List.Item.Meta
                    avatar={
                    <Avatar>{index + 1}</Avatar>
                    }
                    title={<a onClick={() => {
                      props.history.push(`/Admin/TextEdit/${item.textId}`)
                    }}>{item.title}</a>}
                    description="暂无描述"
                  />
                  <div>更新时间：{moment(item.update).format('YYYY-MM-DD HH:MM')}</div>
              </List.Item>
            )}
        />
      </TabPane>
        <TabPane tab="信息文章" key="text">
        <Button type="primary" onClick={() => {
            props.history.push(`/Admin/TextEdit/create_1`)
         }}>发布动态</Button>
         <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={artcleList1}
          renderItem={(item,index) => (
              <List.Item
                actions={[
                <a key="list-loadmore-edit" onClick={() => {
                  props.history.push(`/Admin/TextEdit/${item.textId}`)
                }}>编辑</a>,
                <a key="list-loadmore-more" style={{'color': 'red'}} onClick={() => {
                  destroy(item.textId)
                }}>删除</a>]}
              >
                  <List.Item.Meta
                    avatar={
                    <Avatar>{index + 1}</Avatar>
                    }
                    title={<a onClick={() => {
                      props.history.push(`/Admin/TextEdit/${item.textId}`)
                    }}>{item.title}</a>}
                    description="暂无描述"
                  />
                  <div>更新时间：{moment(item.update).format('YYYY-MM-DD HH:MM')}</div>
              </List.Item>
            )}
        />
        </TabPane>
    </Tabs>
  </>;
}

export default withRouter(Text);