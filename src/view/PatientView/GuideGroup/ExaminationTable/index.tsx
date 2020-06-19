import React, { useEffect, useState } from 'react'
import { graphql } from 'react-apollo';
import { fetchInfoCommonGQL } from '../../../../api/graphql/gql';

import 'antd/dist/antd.css'
import { Table } from 'antd';

const columns = [
  {
    title: '化验项目id',
    dataIndex: 'examinationId',
    key: 'examinationId',
  },
  {
    title: '化验项目',
    dataIndex: 'examinationName',
    key: 'examinationName',
  },
]

function Info (props:any) {
  const [examination, setexamination] = useState<any>([]);

  useEffect(() => {
    if(props.data && props.data.Info) {
      setexamination(props.data.Info.examiation);
    }
  }, [props]);
  
  return (
    <div>
      <Table
          columns={columns}
          pagination={false}
          rowKey={record => record.examinationDesc} 
          expandable={{
            // eslint-disable-next-line react/display-name
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.examinationDesc}</p>,
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
          dataSource={examination}
        />
    </div>
  );
}

export default graphql(fetchInfoCommonGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(Info)