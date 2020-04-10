import React, { useState, useEffect } from 'react'
import { Steps, Divider, message, Tabs, Pagination } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import adminClient from '../../../api/admin'

import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'
import { withRouter } from 'react-router-dom';

const {TabPane} = Tabs;

type artcle = {
  title: string,
  update: string
  textId: number
};

function Artcle (props: any) {
 

  const [artcleList0, setArtcleList0] = useState<artcle[]>([]);
  const [artcleList1, setArtcleList1] = useState<artcle[]>([]);

  const [artcleList0show, setArtcleList0show] = useState<artcle[]>([]);
  const [artcleList1show, setArtcleList1show] = useState<artcle[]>([]);

  const [key, setkey] = useState<string>('0');
  const [current, setcurrent] = useState<number>(1); 

  const fetchData = async () => {
    const res:any = await adminClient.findArtcle();
    const array0 = [];
    const array1 = [];
    if(res.code === 0) {
      res.data.forEach(item => {
        if(item.type == 0 && array0.length < 8) {
          array0.unshift(item);
        } else if (item.type == 1 && array1.length < 8){
          array1.unshift(item);
        }
      });
      setArtcleList0(array0);
      setArtcleList1(array1);
    } else {
      message.error('服务错误哦');
    }
  }

  const listItem = (info) => (
    <div className="patient-artcle-item" key={info.textId} onClick={() => {
      props.history.push(`/Patient/Atrcle/${info.textId}`)
    }}>
      <span>{info.title}</span>
      <span>{moment(info.update).format('YYYY年MM月DD日')}</span>
    </div>

  );

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    if(artcleList0 || artcleList1) {
      onchangcallback('0');
    }
  }, [artcleList0, artcleList1])

  const onChange = (val) => {
    if (key == '0') {
      setArtcleList0show(artcleList0.slice((val-1)*10,val*10));
    } else {
      setArtcleList1show(artcleList1.slice((val-1)*10,val*10));
    }
  }

  const onchangcallback = (val) => {
    setkey(val);
    setcurrent(0);
    setArtcleList0show(artcleList0.slice(0,10));
    setArtcleList1show(artcleList1.slice(0,10));
  }
  
  return (
    <div className="patient-artcle">
      <Tabs onChange={onchangcallback} type="card" className="patient-artcle-body">
        <TabPane tab="医院公告" key="0">
          {
            artcleList0show.map(item => {
              return listItem(item);
            })
          }
        </TabPane>
        <TabPane tab="文章/详情" key="1">
          {
            artcleList1show.map(item => {
              return listItem(item);
            })
          }
        </TabPane>
      </Tabs>
      <Pagination 
          className="patient-artcle-page"
          showQuickJumper 
          showTotal={total => `共 ${total} 条`}
          defaultCurrent={current} 
          defaultPageSize={10}
          total={key == '0' ? artcleList0.length : artcleList1.length} 
          onChange={onChange}
          />
    </div>
  );
}

export default withRouter(Artcle);

// graphql(fetchInfoALLGQL, {
//   options() {
//     return {
//       fetchPolicy: 'cache-and-network',
//     };
//   } 
// })(connect(
//   (state: { user: any; }) => {
//     return {
//       user: state.user
//     }
//   }
// )(Artcle));
