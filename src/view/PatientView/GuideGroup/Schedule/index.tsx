
import React, { useState, useEffect } from 'react'
import SchduleCommon from '../../../../component/ScheduleCommon';
import { graphql } from 'react-apollo';
import { fetchInfoALLGQL } from '../../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'

function Schedule (props: any) {

  const [departmentList, setDepartmentList] = useState<any>([]); // 科室列表

  useEffect(() => {
    if(props.data && props.data.Info) {
      const data = props.data.Info;
      setDepartmentList(data.departmentInfoList);
    }
  }, [props]);

  return (
    <div className="order-table">
      <SchduleCommon departmentList={departmentList} type="data"></SchduleCommon>
    </div>
  )
}

export default graphql(fetchInfoALLGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(Schedule)
