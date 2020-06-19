import React, { useState, useEffect } from 'react'
import adminClient from '../../../api/admin';
import { message, Table, Button, Avatar, Pagination, Form, Input } from 'antd';

import './index.scss';

const AdminUser = () => {

  const [form] = Form.useForm();

  const [userList, setUserList] = useState<any>([]);
  const [page, setPage] = useState<{
    page:number,
    size:number,
  }>({
    page:1,
    size:20
  });

  const columns:any[] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      // eslint-disable-next-line react/display-name
      render: (record: any) => ( 
        <Avatar src={record ? `http://localhost:3000${record}` : ''} />
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '身份证',
      dataIndex: 'idcard',
      key: 'idcard',
    },
    {
      title: '电话号码',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const fetchData = async (params = undefined) => {
    const result:any = await adminClient.getPatient(params);
    if (result.code === 0) {
      setUserList(result.data);
    } else {
      message.error('数据错误');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (page, pageSize) => {
    setPage({
      page: page,
      size: pageSize
    });
    fetchData({
      page: page,
      size: pageSize
    });
  }


  const onFinish = (values) => {
    fetchData({
      userInfo: JSON.stringify(values),
      ...page,
    })
  };

  const onReset = (values) => {
    form.resetFields();
    fetchData({
      userInfo: undefined,
      ...page,
    })
  };
      
  return (
    <>
      <div className="adminuser-form">
        <Form
          layout='inline'
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label="用户名" name="username"> 
            <Input placeholder="输入用户名查找"/>
          </Form.Item>
          <Form.Item label="uid" name="uid">
            <Input placeholder="输入UID查找" />
          </Form.Item>
          <Form.Item label="姓名" name="name">
            <Input placeholder="输入姓名查找" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">查找</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={onReset}>清空</Button>
          </Form.Item>
        </Form>
      </div>
      
      <Table 
      columns={columns} 
      dataSource={userList} 
      rowKey={userList.uid} 
      pagination={false}>
      </Table>

      <Pagination 
      className="adminuser-page"
      showQuickJumper 
      showTotal={total => `共 ${total} 条`}
      defaultCurrent={1} 
      defaultPageSize={20}
      total={userList.length} 
      showSizeChanger
      onChange={onChange}
      onShowSizeChange={onChange} />
    </>
  );
}

export default AdminUser;