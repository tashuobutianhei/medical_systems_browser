import React, { useState, useEffect } from 'react'
import DepartmentItem from '../../../component/DepartmentItem';

import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'
import { Row, Col, Breadcrumb } from 'antd';

function Deprartment (props: any) {
  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表

  useEffect(() => {
    if(props.data && props.data.Info) {
      const data = props.data.Info;
      setDepartmentList(data.departmentInfoList);
    }
  }, [props]);

  return (
    <div className="department">
       <Breadcrumb>
        <Breadcrumb.Item href="">
          <span>科室</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>科室导航</Breadcrumb.Item>
      </Breadcrumb>

      <p className="department-title">科室导航</p>

      <Row gutter={16}>
        {
          departmentList && departmentList.map((item, index) => {
            return (
              <Col key={item.DeprartmentId || index} span={4}>
                <DepartmentItem department={item}></DepartmentItem>
              </Col>
            ) 
          })
        }
      </Row>
    </div>
  );
}

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(Deprartment);