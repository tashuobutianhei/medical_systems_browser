import React from 'react'
import { Button, Row, Col } from 'antd';

import 'antd/dist/antd.css'
import './index.scss'

function Order (props: any) {
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
                      props.nextStep({
                        'department': item
                      });
                    }}
                    className={['order-department-content-item',
                    ].join(' ')}>
                    {item.departmentName}
                  </Col>
                )
              })
            }
        </Row>

        <div className="order-department-footer">
           <Button type="primary" onClick={props.prevStep}
          >返回</Button>
        </div>
    </div>
  );
}

export default Order;