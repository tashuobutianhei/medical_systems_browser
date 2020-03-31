import React, { useState, useEffect } from 'react'
import { Button, message, Row, Col } from 'antd';
import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'

function Order (props: any) {
  const [checked, setChecked] = useState<number|string>(-1);

  const onclickButton = () => {
    if (checked === -1) {
      message.error({
        content: '请选择科室',
        duration: 2
      })
    } else {
      const checkedDepartment = props.department.find(item => item.departmentId == checked);
      props.nextStep({
        'department': checkedDepartment
      });
    }
  }

  const onChecked = (item) => {
    setChecked(item.departmentId);
  }

  return (
    <div className="order-department">
        <p className="order-department-title">
          请按照您的症状，选择合适的科室进行挂号，选择合理的时间，我们的医生都很有优秀，如果您需要分诊，请前往
          <a>科室导航</a>
        </p>
        <Row className="order-department-content" gutter={16}>
            {
              props.department && props.department.map(item => {
                return (
                  <Col key={item.departmentId} 
                    span={4}
                    onClick={()=>{
                      onChecked(item);
                    }}
                    className={['order-department-content-item',
                    item.departmentId == checked ? 'order-department-content-itemChecked' : ''
                    ].join(' ')}>
                    {item.departmentName}
                  </Col>
                )
              })
            }
        </Row>

        <div className="order-department-footer">
          <Button type="primary" 
          onClick={onclickButton}>确认</Button>
        </div>
    </div>
  );
}

export default Order;