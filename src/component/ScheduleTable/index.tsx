import React, { useState, useEffect } from 'react'
import { Table, Select, Button } from 'antd';
import { withRouter } from 'react-router-dom';

import EditScheduleTable from '../EditScheduleTable';

import doctorClient from '../../api/doctor';
import CONST from '../../common/const';

import 'antd/dist/antd.css'
import './index.scss'

const { Option } = Select;

function ScheduleTable(props: {departmentId: string, user: any} & any) {

  const [data, changeData] = useState<any[]>([]); // 早 午 急诊 list
  const [EditdataList, changeEditdataList] =  useState<any[]>([]); // 子tablelist
  const [doctorList, changeDctorList] = useState<any[]>([]); // 医生状态list
  const [seletDoctor, changeseletDoctor] = useState<any>(''); // 选择的医生，表单使用

  let defaultExpandedRowKeys: any[] | undefined = [];
  let doctors:any[] = [];

  // 获得科室医生列表
  async function getDoctors(params: any) {
    const res:any =  await doctorClient.getDocters(params);
    if(res.code === 0) {
      doctors = res.data;
    // 医生状态列表
    changeDctorList(res.data.map((item: any) => {
     return {
      ...item,
     }
    }));
    }
  }
  
  // 获得排班计划
  async function fetchData() {
    const res:any =  await doctorClient.getScheduleList(props.match.params.workDay, props.departmentId);
    if(res.code !== 0) {
      return;
    }
    // 渲染三班的列表
    let array: any[] = [];
    res.data.forEach((item: any) => {
      array.push({
        key:item.wokrId,
        wokrId: item.wokrId,
        shifts: CONST.WORK_SHIFTS[item.shifts],
        time: CONST.WORK_SHIFTS_TIME[item.shifts],
        editer: item.editer,
        add: '10.3.4.5654',
        doctors: item.docters,
        addStatus: false,
      });
    })
    changeData(array);
    defaultExpandedRowKeys = array.map(item => item.wokrId);
  }

  // 初始化
  const initSchedule = () => {
    let midArray: any[] = [];
    data.forEach(itemData => {
      let wokrId = itemData.wokrId;
      let doctors = itemData.doctors;
      if (!doctors) {
        return;
      }
      // 进行对医生列表渲染
      doctors.split(',').forEach((workerId: any) => {
        const theAddDoctor = doctorList.find(item => {
          return item.workerId === workerId;
        })
        if(!theAddDoctor) {
          return;
        }
        midArray = [...midArray, {
          ...theAddDoctor,
          key: wokrId + theAddDoctor.workerId,
          wokrId: wokrId,
          sex: theAddDoctor.sex == 1 ? '男' : '女'
        }];
      })
    })
    changeEditdataList(midArray);
  }

  useEffect(() => {
    if(!props.departmentId) {
      return;
    }
    getDoctors({departmentId: props.departmentId});
    fetchData();
  }, [props.match.params.workDay]);

  useEffect(() => {
    if (data.length > 0) {  
      initSchedule();
    }
  }, [data]);

  // 事件处理
  // 增加排班
  const addWork = async (record: any) => {
    const res: any = await doctorClient.addSchedule({
      wokrId: record.wokrId,
      workerId: seletDoctor,
    });
    if (res.code === 0) {
      // debugger;
      // const theAddDoctor = doctorList.find(item => {
      //   return item.workerId === seletDoctor;
      // })
      // let midArray = [...EditdataList, {
      //   ...theAddDoctor,
      //   key: theAddDoctor.workerId,
      //   wokrId: record.wokrId
      // }];
      // changeEditdataList([midArray]);
      fetchData()
    }
    changeseletDoctor('');
    changeAddStatus(record, false);
  }

  const deleteWork = async (record: any, wokrId: string) => {
    const res: any = await doctorClient.deleteSchedule({
      wokrId: wokrId,
      workerId: record[0].workerId,
    });
    if (res.code === 0) {
      fetchData()
    }
  }

  // 过滤子表展示数据
  const fliterData = (wokrId: string | number) => {
    return EditdataList.filter(item => item.wokrId === wokrId);
  }

  // 修改状态
  const changeAddStatus = (record: any, addStatus: boolean) => {
    let mid = data;
    mid = mid.map(item => {
      if(item.wokrId === record.wokrId) {
        return {
          ...item,
          addStatus
        }
      } else {
        return item
      }
    })
    changeData(mid);
  }

  const checkDisabled = (wokrId: string, workerId: string ) => {
    let theEditData = fliterData(wokrId);
    let flag = false;
    theEditData.forEach(item => {
      if(item.workerId === workerId) {
        flag = true;
      }
    })
    return flag;
  }

  const columns = [
    { title: '班次序列号', dataIndex: 'wokrId', key: 'wokrId' },
    { title: '班次', dataIndex: 'shifts', key: 'shifts' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '编辑人',
      dataIndex: 'editer',
      key: 'editer',
      // eslint-disable-next-line react/display-name
      render: (record: any) => {
        return (
          (<span>{
            record ? 
            doctorList.find(item => item.workerId === record) ? 
            doctorList.find(item => item.workerId === record).name : '': '暂无编辑'
          }</span>)
        )
      }

   },
    { title: '添加', 
      key: 'add', 
      width: 400,
      // eslint-disable-next-line react/display-name
      render: (record: any) => {
        return (
          <div>
          {
            record.addStatus ? 
            <div>
              <Select style={{ width: 180, marginRight: '15px' }} onChange={(value) => {
                changeseletDoctor(value);
              }}>
                {
                  doctorList.map(item =>
                    <Option 
                    key={item.workerId} 
                    value={item.workerId} 
                    disabled={checkDisabled(record.wokrId, item.workerId)}
                  ><span style={{fontWeight: 'bolder'}}>{item.name}</span>({item.workerId})
                  </Option>
                  )
                }
              </Select>
              <Button type="primary"  onClick={() => {
                addWork(record);
              }}>确定</Button>
              <Button type="danger"  onClick={() => {
                changeAddStatus(record, false);
                changeseletDoctor('');
              }}>取消</Button>
            </div>
            :<Button type="primary" 
              disabled={props.user.position !== 'director'} 
              onClick={()=> {
                changeAddStatus(record, true);
              }}>添加</Button> 
          }
         </div>
        )
      }
    },
  ];

  return (
    <Table
      defaultExpandedRowKeys={defaultExpandedRowKeys}
      bordered
      rowKey={record => record.wokrId} 
      className="schdeuleTable"
      columns={columns}
      expandedRowRender={(record: any) => {
        return (
        <EditScheduleTable 
          data={fliterData(record.wokrId)} 
          delete={deleteWork}
          wokrId={record.wokrId}>
        </EditScheduleTable>)
      }}
      dataSource={data}
      pagination={false}
    />
  );
}

export default  withRouter(ScheduleTable);

