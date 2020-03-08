import { Modal, Row, Col, message } from 'antd';
import React, { useState, useEffect } from 'react';
import orderClient from '../../api/order';
import CONST from '../../common/const';
import monent from 'moment'

type Props = {
  visabley: boolean
  setvisable: any
  orderInfo: {
    departmentId?: string | number
    workerId?: string
    wokrId?: string
    doctorInfo? : any
  },
  nextStepFuc: any
}

function OrderModal(props: Props){
  const [confirmLoading, setconfirmLoading] = useState<boolean>(false);
  const [order, setorder] = useState<any>({});
  const [doctor, setDoctor] =  useState<any>({});

  const { visabley, setvisable, nextStepFuc } = props;

  const handleOk = async () => {
    setconfirmLoading(true);
    const res:any = await orderClient.order({
      workerId: props.orderInfo.workerId,
      wokrId: props.orderInfo.wokrId,
    })

    if(res.code === 0) {
      setconfirmLoading(false);
      
      setvisable(false);
      message.success({
        content: '挂号成功'
      })
      nextStepFuc(res.data.caseId);
    } else {
      setconfirmLoading(false);
      message.error({
        content: '挂号失败'
      })
    }
  };

  const handleCancel = () => {
    setvisable(false);
  };

  const fatchData = async () => {
    const res: any = await orderClient.findOrder({
      workerId: props.orderInfo.workerId,
      wokrId: props.orderInfo.wokrId,
    })
    if(res.code === 0) {
      setorder(res.data);
    }
  }

  useEffect(() => {
    if(visabley) {
      fatchData();
      setDoctor(props.orderInfo.doctorInfo)
    }
  }, [visabley])

  return (
    <div className="orderModal">
      <Modal
        title="挂号确认"
        visible={visabley}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <p style={{textAlign: "center"}}>当前医生坐班信息确认</p>
        <p>
          <span style={{paddingRight: "10px", fontWeight: 'bolder'}}>值班医生：</span>
          <a>{doctor.name || ''}</a>
          ({CONST.DOCTOR_POSITION[doctor.position || '']})
        </p>
        <p>
          <span style={{paddingRight: "10px", fontWeight: 'bolder'}}>门诊时间：</span>
          <span>{monent(order.wokrId ? order.wokrId.slice(0, 8) : 20200101 , 'YYYYMMDD').format('YYYY-MM-DD')} 
          {CONST.WORK_SHIFTS[order.wokrId ? order.wokrId.charAt(10): 0]}</span>
        </p>
        <Row justify="space-between" style={{
          color: order.limit === order.patientCases && order.limit !== null? 'red' : 'black'
          }}>
          <Col span={10}>
            <span>当前已挂</span>: {order.patientCases ? order.patientCases.split(',').length : 0}
          </Col>
          <Col span={10}>
            <span>门诊上限</span>: {order.limit ? order.limit : '暂无上限'}
          </Col>
        </Row>
        <p style={{color: 'gray', fontSize: '10px', paddingTop:'10px'}}>
          * 如果当前已挂过多，可能会出现挂号成功但是因为排队会无法成功诊治的情况,建议衡量后进行挂号诊治，不耽误您的身体健康</p>
      </Modal>
    </div>
  );
  
}

export default OrderModal;