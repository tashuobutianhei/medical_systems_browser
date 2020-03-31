import { Form, Input, Modal, message } from 'antd';
import adminClient from '../../api/admin';
import React from 'react';
type propsType = {
  addExamVisable: boolean,
  setExamVisable: any,
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
    props.setExamVisable(false);
  }

  const onFinish = async (values) => {
    const res:any = await adminClient.addExam(values);
    if(res.code === 0 ) {
      message.success({
        content: '添加成功'
      })
      props.setExamVisable(false);
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
      visible={props.addExamVisable} 
      onOk={onOk} 
      onCancel={onCancel}>
    <Form
      form={form}
      {...layout}
      name="exam"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="项目名称" name="examinationName"
        rules={[
          {
            required: true,
            message: '必须要有一个项目名',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="项目简介" name="examinationDesc"
        rules={[
          {
            required: true,
            message: '为项目写一个简介',
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