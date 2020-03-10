import React, { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CONST from '../../common/const';
import { Input, Select, Button, Row, Col, Switch, message, Divider, Collapse, Radio } from 'antd';
import patientCaseClient from '../../api/patientCase';
import moment from 'moment';
import randomString from 'random-string';

import 'antd/dist/antd.css'
import './index.scss'

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;


type Props = {
  // patientCase: any,
  examination: any,
  mode: string,
  hospitalList: any[],
}

type assayType = {
  assayId: any,
  examinationId: number,
  examinationResult: string
}

type hospitalType = {
  HospitalizationId: string | number,
  assays: assayType[],
  patientStatus: string,
  medicine: string,
  TreatmentRecord: string,
  recovery: string,
  date: Date
}

function DocterWorkTable (props: Props & RouteComponentProps) {

  const [patientStatus, setPatientStatus] = useState<string>('');
  const [medicine, setMedicine] = useState<string>('');
  const [TreatmentRecord, setTreatmentRecord] = useState<string>('');
  const [recovery, setRecovery] = useState<string>('');


  const [hospital, setHospital] = useState<hospitalType[]>([{
    HospitalizationId: 0,
    assays: [{
      assayId: 0,
      examinationId: 0,
      examinationResult: ''
    }],
    patientStatus: '',
    medicine: '',
    TreatmentRecord: 'string',
    recovery: '',
    date: new Date(),
  }]);

  useEffect(() => {
    if (Array.isArray(props.hospitalList)) {
      if (props.hospitalList.length > 0) {
          setHospital(props.hospitalList);
      }
    }
  }, [props.hospitalList])

  const addHosipatal = () => {
    let id = randomString({length: 12, numbers: true});

    setHospital([
      ...hospital, {
        HospitalizationId: id,
        assays: [{
          assayId: randomString({length: 12, numbers: true}),
          examinationId: 0,
          examinationResult: ''
        }],
        patientStatus: '',
        medicine: '',
        TreatmentRecord: 'string',
        recovery: '',
        date: new Date(),
      }
    ])
  }

  const handleDeleteAssay = (hosId: any, assayId: any) => {
    setHospital(hospital.map(item => {
      if(item.HospitalizationId === hosId) {
        let id = item.assays.length + 1;
        return {...item, 
          assays: item.assays.filter(item => {
            return item.assayId !== assayId;
          })
        }
      }
      return item;
    }))
  }

  const handleAddAssay = (hosId: any, ) => {
    setHospital(hospital.map(item => {
      if(item.HospitalizationId === hosId) {
        let id = randomString({length: 12, numbers: true});

        return {...item, assays: [...item.assays, {
          'assayId': id,
          'examinationId': 0,
          'examinationResult': ''
        }]}
      }
      return item;
    }))
  }

  const assaySelectChange = (val: any, hosId: any, assayId: any) => {
    debugger
    setHospital(hospital.map(item => {
      if(item.HospitalizationId === hosId) {
        // let id = item.assays.length + 1;
        debugger
        return {...item, assays: item.assays.map(it => {
          if(it.assayId === assayId) {
            debugger
            return {
              ...it,
              examinationId: val
            }
          } else {
            return it
          }
        })}
      }
      return item;
    }))
  }

  const assayInputChange = (val: any, hosId: any, assayId: any) => {
    setHospital(hospital.map(item => {
      if(item.HospitalizationId === hosId) {
        let id = item.assays.length + 1;
        return {...item, assays: item.assays.map(it => {
          if(it.assayId === assayId) {
            return {
              ...it,
              examinationResult: val
            }
          } else {
            return it
          }
        })}
      }
      return item;
    }))
  }


  const FormChangeHandle = (key: string, value: any, hosId: any) => {
    setHospital(hospital.map(item => {
      if(item.HospitalizationId === hosId) {
         item[key] = value;
         return item;
      }
      return item;
    }));
  }

  return(
  <>
  <Collapse  className="workTable-col" defaultActiveKey={hospital.map(item => item.HospitalizationId)}>
    <div>
      <span className="workTable-label">住院记录:</span> 
      <Button type="primary" onClick={addHosipatal} disabled={props.mode !== 'hospital'}>新增记录</Button>
    </div>
    {
      hospital.map(hosItem => {
        return (
          <Panel header={moment(hosItem.date).format('YYYY-MM-DD hh:mm a')} 
           key={hosItem.HospitalizationId}>
            <Row justify='space-between' className="workTable-hosptalItem">
              <Col className="workTable-row"> 
                  <span className="workTable-label">病人状态:</span>
                  <div className="workTable-textArea">
                    <Input 
                    width={500}
                    allowClear={true} 
                    disabled={props.mode !== 'hospital'}
                    placeholder="请您填入您对病情的描述"
                    value={patientStatus}
                    onChange={(val) => {
                      FormChangeHandle('patientStatus', val.target.value, hosItem.HospitalizationId);
                    }}></Input>
                  </div>
              </Col>
              <Col className="workTable-row">
                  <span className="workTable-label">是否达到出院状态:</span>
                  <div className="workTable-textArea">
                    <Radio.Group 
                    // value={recovery}
                    onChange={(val) => {
                      FormChangeHandle('recovery', val, hosItem.HospitalizationId);
                    }} defaultValue={recovery}>
                      <Radio.Button value="0">未达到</Radio.Button>
                      <Radio.Button value="1">达到</Radio.Button>
                    </Radio.Group>
                  </div>
              </Col>
            </Row>


            <div className="workTable-hosptalItem">
              <span className="workTable-label">治疗记录:</span>
              <div className="workTable-textArea">
                <TextArea 
                autoSize={false}
                rows={3} 
                allowClear={true} 
                disabled={props.mode !== 'hospital'}
                placeholder="请您填入您对病情的描述"
                value={TreatmentRecord}
                onChange={(val) => {
                  FormChangeHandle('TreatmentRecord', val.target.value, hosItem.HospitalizationId);
                }}></TextArea>
              </div>
            </div>

            <div className="workTable-hosptalItem">
              <span className="workTable-label">药物:</span>
              <div className="workTable-textArea">
                <Select 
                mode="tags" 
                disabled={props.mode !== 'hospital'}
                style={{ width: '100%' }} 
                placeholder='请对症开药'
                value={medicine.length > 0 && medicine.split(',').length > 0 ? medicine.split(',') : []}
                onChange={(val) => {
                  let medicineVal = '';
                  if(Array.isArray(val)) {
                    medicineVal = val.join(',');
                  }
                  FormChangeHandle('medicine', medicineVal, hosItem.HospitalizationId);
                }}
                tokenSeparators={[',']}>
                </Select>
              </div>
            </div>

            <div className="workTable-hosptalItem">
                {
                hosItem.assays.map(assayItem => {
                    return (
                    <Row key={assayItem.assayId} justify='space-between' className="workTable-formCol">
                        <Col>
                          <span style={{paddingRight: '10px'}} className="workTable-label">选择检查项目：</span>
                          <Select 
                          style ={{ width: 160 }} 
                          disabled={props.mode !== 'hospital'}
                          defaultValue={assayItem.assayId.length >= 12 ? '' : assayItem.assayId}
                          onChange={(val)=>{
                            assaySelectChange(val, hosItem.HospitalizationId, assayItem.assayId);
                          }}>
                            {
                              Array.isArray(props.examination) && props.examination.map(item => {
                                return (
                                  <Option key={item.examinationId} value={item.examinationId}>
                                    {item.examinationName}
                                  </Option>
                                )
                              })
                            }
                          </Select>
                        </Col>
                        <Col>
                          <Input 
                          placeholder="填写检查结果" 
                          disabled={props.mode !== 'hospital'} 
                          value={assayItem.examinationResult}
                          onChange={(e)=> {
                            assayInputChange(e.target.value,hosItem.HospitalizationId, assayItem.assayId);
                          }}></Input>
                        </Col>
                        <Col>
                          <Button type='primary' 
                          disabled={props.mode !== 'hospital'} 
                          onClick={() => {
                            handleAddAssay(hosItem.HospitalizationId)
                          }}>添加</Button>
                          {
                            hosItem.assays.length > 1 ?  <Button type='danger' 
                            disabled={props.mode !== 'hospital'} 
                            onClick={() => {
                              handleDeleteAssay(hosItem.HospitalizationId, assayItem.assayId)
                            }}>删除</Button> : null
                          }
                        </Col>
                    </Row>
                    )
                    })
                  }
                </div>
          </Panel>
        )
      })
    }
    </Collapse>
    </>
  );
}

export default withRouter(DocterWorkTable);