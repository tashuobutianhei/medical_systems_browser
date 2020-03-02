import React, { useEffect } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import SceduleTable from '../../../component/ScheduleTable/index';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router-dom';
import doctorClient from '../../../api/doctor';
import moment from 'moment';
import 'antd/dist/antd.css'
import './index.scss'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function DocterInfo (props: any & RouteComponentProps) {

  // 获得近六天的list
  const getScheduleDateList = () => {
    const ScheduleDateList = [];
    const step = 86400000;
    for (let i = 0; i < 6; i++) {
      const itemDate = new Date(Date.now() + i * step);
      ScheduleDateList.push(new Date(moment(itemDate).format('YYYY-MM-DD')));
    }
    return ScheduleDateList;
  }

  // 格式化展示的字符
  const getDateString = (date: Date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}年${month}月${day}日`;
  }
  
  // 格式化route/:key
  const getRouteKey= (date: Date) => {   
    return moment(date).format('YYYY-MM-DD').split('-').join('');
  }

  useEffect(() => {
    if(!props.user.departmentId) {
      return;
    }
    async function fetchData() {
      await doctorClient.createWorkList(props.user.departmentId);
    }
    fetchData();
    let key = getRouteKey(getScheduleDateList()[0]);
    props.history.push(`/Doctor/Schedule/${key}`);
  }, [props.user.departmentId])

  return (
    <div>
      <Layout className="doctor-schedule">
        <Sider width={200} style={{ background: '#fff' }}> 
        <Menu
          mode="inline"
          defaultSelectedKeys={[getScheduleDateList()[0].toDateString()]}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <UserOutlined />
                排班表
              </span>
            }
          >
            {
              getScheduleDateList().map(item => {
                return (
                  <Menu.Item key={item.toDateString()} onClick={
                    () => {
                      props.history.push(`/Doctor/Schedule/${getRouteKey(item)}`)
                    }
                  }
                  >{getDateString(item)}</Menu.Item>
                )
              })
            }
          </SubMenu>
          </Menu>
        </Sider>
        <Content className="content">
          <Switch>
              <Route exact path="/Doctor/Schedule/:workDay" component={() => {
                return(
                  <SceduleTable departmentId={props.user.departmentId} user={props.user}></SceduleTable>
                )
              }} ></Route>
          </Switch>
        </Content>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state: { user: any; }) => {
  return {
    user: state.user
  }
}

export default withRouter(
  connect(
    mapStateToProps,
  )(DocterInfo)
);