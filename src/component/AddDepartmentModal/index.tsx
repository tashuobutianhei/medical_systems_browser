import { Form, Input, Modal, message } from 'antd';
import adminClient from '../../api/admin';
import React from 'react';
type propsType = {
  addDepartmentVisable: boolean,
  setAddDepartmentVisable: any,
  success: any,
}
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const Demo = (props: propsType) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  }

  const onCancel = () => {
    props.setAddDepartmentVisable(false);
  }

  const onFinish = async (values) => {
    const res:any = await adminClient.addDepartment(values);
    if(res.code === 0 ) {
      message.success({
        content: '添加成功'
      })
      props.setAddDepartmentVisable(false);
      props.success();
    } else {
      message.error({
        content: '添加失败'
      })
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal 
      title="添加科室"
      visible={props.addDepartmentVisable} 
      onOk={onOk} 
      onCancel={onCancel}>
    <Form
      form={form}
      {...layout}
      name="department"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="科室名称" name="departmentName"
        rules={[
          {
            required: true,
            message: '必须要有一个科室名',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="科室简介" name="information"
        rules={[
          {
            required: true,
            message: '为科室写一个简介',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
    </Modal>
  );
};

export default Demo