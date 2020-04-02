import React, { useEffect, useState } from 'react'
// import { Layout, Menu, Avatar, BackTop, Dropdown, Icon } from 'antd';
// import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { graphql } from 'react-apollo';
import { fetchInfoCommonGQL } from '../../../../api/graphql/gql';

import 'antd/dist/antd.css'
import './index.scss'

function Info (props:any) {
  const [doctorRead, setDoctorRead] = useState<string>('');

  useEffect(() => {
    if(props.data && props.data.Info) {
      setDoctorRead(props.data.Info.commonInfo.doctor)
    }
  }, [props]);
  
  return (
    <div>{doctorRead}</div>
  );
}

export default graphql(fetchInfoCommonGQL, {
  options() {
    return {
      fetchPolicy: 'cache-and-network',
    };
  } 
})(Info)