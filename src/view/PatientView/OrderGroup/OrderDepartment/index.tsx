import React, { useState, useEffect } from 'react'
import { Button, Checkbox, message, Row, Col } from 'antd';
import departmentlient from '../../../../api/department';


import 'antd/dist/antd.css'
import './index.scss'

function Order (props: any) {
  const [department, setDepartment] = useState<any[]>([]);
  const [checked, setChecked] = useState<number|string>(-1);

  const onclickButton = () => {
    if (checked === -1) {
      message.error({
        content: '请选择科室',
        duration: 2
      })
    } else {
      props.nextStep({
        'departmentId': checked
      });
    }
  }

  const onChecked = (item) => {
    setChecked(item.departmentId);
  }

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await departmentlient.getdepartments();
      if(res.code === 0) {
        setDepartment(res.data);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="order-department">
        <p className="order-department-title">
          请按照您的症状，选择合适的科室进行挂号，选择合理的时间，我们的医生都很有优秀，如果您需要分诊，请前往
          <a>科室导航</a>
        </p>
        <Row className="order-department-content" gutter={16}>
            {
              department.map(item => {
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