import React from 'react'
import 'antd/dist/antd.css'
import './index.scss'
import { withRouter, RouteComponentProps } from 'react-router';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type propsType = {
  department: any
}

function DeprartmentItem (props: propsType & RouteComponentProps) {
  const { department } = props;
  return (
    <div>
      <Button 
      icon={<LeftOutlined />}
      onClick={()=> {
        props.history.push(`/Patient/DepartmentItem/${department.departmentId}`);
      }}
      type="dashed" size="large" 
      key={department.departmentId} style={{width: '130px', marginRight: '8px'}}>
        {department.departmentName}
      </Button>
    </div>
  );
}

export default withRouter(DeprartmentItem);