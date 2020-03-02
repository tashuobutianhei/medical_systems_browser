import { Table } from 'antd';
import React from 'react';
import CONST from '../../common/const';

function EditTable (props: any) {

  const columns = [
    {
      title: '',
      width: 40,
      render: (a) => {
        console.log()
        return  <span>{props.data.map(item => item.workerId).indexOf(a.workerId)+1}</span>
      }
     
    },
    {
      title: '工号',
      dataIndex: 'workerId'
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '职称',
      dataIndex: 'position',
      render: (a) => <span>{CONST.DOCTOR_POSITION[a]}</span>
      },
    {
      title: '电话',
      dataIndex: 'tel',
    },
    {
      title: 'action',
      dataIndex: 'action',
      render: () => <a onClick={() => {
        props.delete(props.data, props.wokrId);
      }}>移除</a>,
    }]
    
  return (
    <Table dataSource={props.data} columns={columns} rowKey={props.data.key} pagination={false}></Table>
  )
}

export default EditTable;