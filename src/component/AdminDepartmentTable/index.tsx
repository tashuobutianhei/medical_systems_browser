/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { message, Table, Button } from 'antd';
import CONST from '../../common/const';
import adminClient from '../../api/admin';
import './index.scss';

type porpsType= {
  departmentList: any,
  success: any,
}

const AdminDepartment = (props: porpsType) => {
  
  useEffect(() => {
    // console.log(props)
  }, [props.departmentList])

  const deleteDepartment = async (departmentId) => {
    const res:any = await adminClient.deleteDepartment({
      departmentId,
    });

    if(res.code === 0) {
      message.success({
        content: '删除成功'
      })
      props.success();
    } else {
      message.success({
        content: '删除失败'
      })
    }
  }


  const columns = [
    { title: '科室ID', dataIndex: 'departmentId', key: 'departmentId', width: 100 },
    { title: '科室名称', dataIndex: 'departmentName', key: 'departmentName',  width: 150, 
      render: (record) => <div>
      <span className="adminDepartmenTable-noActive">{record}</span>
    </div> },
    { title: '科室描述', dataIndex: 'information', key: 'information',
      render: (record) => <div>
        <span className="adminDepartmenTable-noActive">{record}</span>
      </div> },
    { title: '科室主任', dataIndex: 'loader', key: 'loader',  width: 200 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200 ,
      render: (text, record) => <Button type="danger"
      onClick={() => {
        deleteDepartment(record.departmentId);
      }}>
        移除
      </Button>,
    }
  ];


  const fliterData = (departmentId) => {
    return props.departmentList &&  props.departmentList.find((item: any) => {
      return item.departmentId === departmentId;
    }).doctorList || []
  };

  const formData = () => {
    return props.departmentList && props.departmentList.map(item => {
      const loader = item.doctorList && item.doctorList.filter(doctor => {
        return doctor.position === 'director' ? item : null
      });
      
      return {
        departmentId:item.departmentId,
        departmentName:item.departmentName,
        information:item.information,
        loader: loader ? loader.map(item => item.name).join(',') : ''
      }
    })
  }

  return (
    <div className="adminDepartmenTable">
        <Table
          bordered
          dataSource={formData()}
          rowKey={record => record.departmentId} 
          // className="schdeuleTable"
          columns={columns}
          expandedRowRender={(record: any) => {
            return (
            <EditTable 
              success={props.success}
              data={fliterData(record.departmentId)} 
              // delete={deleteWork}
              // wokrId={record.wokrId}
              >
            </EditTable>)
          }}
          >
        </Table>
    </div>
  );
}


function EditTable (props: any) {

  const deleteDoctor = async (workerId) => {
    const res:any = await adminClient.outDocter({
      workerId,
    });

    if(res.code === 0) {
      message.success({
        content: '删除成功'
      })
      props.success();
    } else {
      message.success({
        content: '删除失败'
      })
    }
  }

  const columns = [
    { title: '工号', dataIndex: 'workerId'},
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '性别', dataIndex: 'sex',
      render: (a) => <span>{CONST.SEX[a]}</span>
    },
    { title: '职称', dataIndex: 'position',
      render: (record) => <div>
        <span className="adminDepartmenTable-noActive">{CONST.DOCTOR_POSITION[record]}</span>
      </div> 
      },
    { title: '电话', dataIndex: 'tel'},
    {
      title: 'action',
      dataIndex: 'action',
      render: (text, record) => (
        record.status == '-1' ? "已离职" : 
        <a onClick={() => {
          deleteDoctor(record.workerId);
        }}>离职</a> 
      ),
    }
  ]
    
  return (
    <Table dataSource={props.data} columns={columns} rowKey={props.data.workerId} pagination={false}></Table>
  )
}

export default AdminDepartment;