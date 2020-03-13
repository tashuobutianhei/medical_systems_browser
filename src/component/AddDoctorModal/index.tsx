import { Form, Input, Modal, message, Select, Radio } from 'antd';
import adminClient from '../../api/admin';
import React from 'react';
import CONST from '../../common/const';


const { Option } = Select;

type propsType = {
  addDoctorVisable: boolean,
  setAddDoctorVisable: any
  departmentList: any,
  success: any
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
    props.setAddDoctorVisable(false);
  }

  const onFinish = async (values) => {
    const res:any = await adminClient.addDocter(values);
    if(res.code === 0 ) {
      message.success({
        content: '添加成功'
      })
      props.setAddDoctorVisable(false);
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
      title="添加医生"
      visible={props.addDoctorVisable} 
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
      <Form.Item label="分配科室" name="departmentId"
        rules={[
          {
            required: true,
            message: '请分配科室',
          },
        ]}
      >
        <Select>
           {
             props.departmentList && props.departmentList.map(item => {
               return (
                <Option key={item.departmentId} value={item.departmentId}>
                  {item.departmentName}
                </Option>
               )
             })
           }
        </Select>
      </Form.Item>
      <Form.Item label="职位" name="position"
        rules={[
          {
            required: true,
            message: '选择职位',
          },
        ]}
      >
        <Select>
           {
             Object.keys(CONST.DOCTOR_POSITION).map(item => {
               return (
                <Option key={item} value={item}>
                  {CONST.DOCTOR_POSITION[item]}
                </Option>
               )
             })
           }
        </Select>
      </Form.Item>
      <Form.Item label="姓名" name="name"
        rules={[
          {
            required: true,
            message: '填入姓名',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="身份证号" name="idcard"
        rules={[
          {
            required: true,
            message: '填入身份证号',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="性别" name="sex"
        rules={[
          {
            required: true,
            message: '填入性别',
          },
        ]}
      >
        <Radio.Group >
            <Radio value={0}>女</Radio>
            <Radio value={1}>男</Radio>
        </Radio.Group>
            
      </Form.Item>

      <Form.Item label="年龄" name="age"
        rules={[
          {
            required: true,
            message: '填入年龄',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="电话" name="tel"
        rules={[
          {
            required: true,
            message: '填入电话',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="介绍" name="information"
        rules={[
          {
            required: true,
            message: '填入简介',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="毕业院校" name="university"
        rules={[
          {
            required: true,
            message: '填入院校',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="地址" name="address"
        rules={[
          {
            required: true,
            message: '填入地址',
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