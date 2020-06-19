/* eslint-disable react/display-name */
import React, { useState, useEffect, useReducer } from 'react'
import { Tabs, message, Upload, Button, Table, Modal, Input } from 'antd';
import { graphql } from 'react-apollo';
import { fetchInfoCommonGQL } from '../../../api/graphql/gql';
import adminClient from '../../../api/admin';
import departmentClient from '../../../api/department';
import AddExamModal from '../../../component/AddExamModal/index';
import './index.scss';
const { TabPane } = Tabs;

const AdminInfo = (props: any) => { 
  let initInfo = {};

  const [mode, setMode] = useState<any>({
    home: 'data',
    examination: 'data',
    doctor: 'data',
    order: 'data'
  });

  const [tab, setTab] = useState<any>('home');
  const [examVisable, setExamVisable] = useState<boolean>(false);

  const [fileList, setFileList] = useState<any>([]);
  const [examination, setExamination] = useState<any>([]);
  
  const [info, dispatch ] = useReducer((state, action) => {
     switch(action.type){
            case 'set':
                return action.data;
            case 'updata':
                return {
                  ...state,
                  ...action.val
                }
            case 'reset':
                return initInfo;
            }
  }, {
    id: 0,
    carousel: null,
    order: '',
    doctor: ''
  });


  const columns = [
    {
      title: '化验项目id',
      dataIndex: 'examinationId',
      key: 'examinationId',
    },
    {
      title: '化验项目',
      dataIndex: 'examinationName',
      key: 'examinationName',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => {
        return (
          (<Button type="primary" danger
          onClick={() => {
            Modal.confirm({
              content: '是否确定删除',
              onOk() {
                adminClient.deleteExam({
                  examinationId: record.examinationId
                }).then((res:any) => {
                  if(res.code === 0) {
                    // message.error('删除失败')
                   setExamination(examination.filter((item:any) => {
                      return item.examinationId != record.examinationId
                    }));
                  } else {
                    message.error('删除失败')
                  }
                })
              },
              onCancel() {},
            })


          }}
          disabled={mode[tab] === 'data'} >删除</Button>)
        )
      }
    },
  ]

  useEffect(() => {
    if(props.data && props.data.Info) {
      const data = props.data.Info;
      setExamination(data.examiation);

      dispatch({type: 'set', data: data.commonInfo})
      initInfo = info;
      initImg(data.commonInfo.carousel);
    }
  }, [props]);

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
      case 'examination':
        let obj = {...mode};
        obj[tab] = 'data'
        setMode({
          ...obj
        });
      break;
      case 'doctor':
        updateClient({
          type: 'doctor',
          data: info.doctor
        });
      break;
      case 'order':
        updateClient({
          type: 'order',
          data: info.order
        })
      break;
      default:
        break;
    }
  }

  return (
    <>
    <AddExamModal addExamVisable={examVisable} 
    setExamVisable={setExamVisable} 
    success={async ()=>{
      const res:any = await departmentClient.getExamination();
      if (res.cdoe === 0) {
        setExamination(res.data);
      }
    }}></AddExamModal>
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
          <Table
            columns={columns}
            pagination={false}
            rowKey={record => record.examinationDesc} 
            expandable={{
              expandedRowRender: record => <p style={{ margin: 0 }}>{record.examinationDesc}</p>,
              rowExpandable: record => record.name !== 'Not Expandable',
            }}
            dataSource={examination}
          />
        </TabPane>
        <TabPane tab="就医须知" key="doctor">
          <p>编辑就医需知</p>
          <Input.TextArea 
          value={info.doctor}
          rows={10}
          onChange={(e) => {
            dispatch({
              type: 'updata', 
              val: {
                doctor: e.target.value
              }
            })
          }}
          disabled={mode['doctor'] === 'data'}> 
          </Input.TextArea>
        </TabPane>
        <TabPane tab="挂号须知" key="order">
        <p>编辑挂号须知</p>
          <Input.TextArea 
          value={info.order}
          rows={10}
          onChange={(e) => {
            dispatch({
              type: 'updata', 
              val: {
                order: e.target.value
              }
            })
          }}
          disabled={mode['order'] === 'data'}> 
          </Input.TextArea>
        </TabPane>
      </Tabs>
      <div className="adminInfo-edit">
      {
        mode[tab] === 'data' ? 
        <Button onClick={() => {
          let obj = {...mode};
          obj[tab] = 'edit'
          setMode({
            ...obj
          });
        }}>编辑</Button> 
        : <Button onClick={update} type="primary">保存</Button> 
      }
      {
        mode[tab] !== 'data' && tab === 'examination' ?
        <Button 
        style={{
          marginLeft: '10px'
        }}
        onClick={() => {
          setExamVisable(true)
        }} 
        type="primary">增加项目</Button> : null
      }
      </div>           
    </div>
    </>
  )
}

export default graphql(fetchInfoCommonGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(AdminInfo)