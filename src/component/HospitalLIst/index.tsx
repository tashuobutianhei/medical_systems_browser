import React, { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CONST from '../../common/const';
import { Input, Select, Button, Row, Col, Switch, message, Divider, Collapse, Radio } from 'antd';
import patientCaseClient from '../../api/patientCase';
import moment from 'moment';
import randomString from 'random-string';
import { updateHospitalInfo, updateHospitalAssay } from '../../action/patientCase';


import 'antd/dist/antd.css'
import './index.scss'
import { connect } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;


type Props = {
  // patientCase: any,
  examination: any,
  mode: string,
  hospitalList: any[],
  updatePatient: any,
  updatePatientAssay: any
  patientCaseInfo: any
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
  useEffect(() => {
    if (Array.isArray(props.hospitalList)) {
      if (props.hospitalList.length > 0) {
          props.updatePatient(props.hospitalList.map(item => {
            const assays = item.assayList && Array.isArray(item.assayList) &&
            item.assayList.map((assay) => {
              return {
                assayId: assay.assayId,
                examinationId: assay.assayName,
                examinationResult: assay.assayResult,
              }
            })
            return {
              ...item,
              'type': 'data',
              assays,
            }
          }), '' ,'set');
      }
    }
  }, [props.hospitalList])

  const addHosipatal = () => {
    props.updatePatient('', '' ,'add');
  }

  const handleDeleteAssay = (hosId: any, assayId: any) => {
    props.updatePatientAssay({}, hosId, assayId, 'delete');
  }

  const handleAddAssay = (hosId: any, ) => {
    props.updatePatientAssay({}, hosId, {}, 'add');
  }

  const assaySelectChange = (val: any, hosId: any, assayId: any) => {
    props.updatePatientAssay({
      'examinationId': val
    }, hosId, assayId, 'update');
  }

  const assayInputChange = (val: any, hosId: any, assayId: any) => {
    props.updatePatientAssay({
      'examinationResult': val
    }, hosId, assayId, 'update');
  }

  const FormChangeHandle = (key: string, value: any, hosId: any) => {
    let obj = {};
    obj[key] = value;
    props.updatePatient(obj, hosId, 'update');
  }

  return(
  <>
  <Collapse  className="workTable-col" defaultActiveKey={props.patientCaseInfo.hospitalList.map(item => item.HospitalizationId)}>
    <div>
      <span className="workTable-label">住院记录:</span> 
      <Button type="primary" onClick={addHosipatal} disabled={props.mode !== 'hospital'}>新增记录</Button>
    </div>
    {
      props.patientCaseInfo.hospitalList.map(hosItem => {
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
                    disabled={props.mode !== 'hospital' || hosItem.type === 'data'}
                    placeholder="请您填入您对病情的描述"
                    value={hosItem.patientStatus}
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
                    disabled= {
                      props.mode !== 'hospital' || hosItem.type === 'data'
                    }
                    onChange={(val) => {
                      FormChangeHandle('recovery', val, hosItem.HospitalizationId);
                    }} defaultValue={hosItem.recovery}>
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
                disabled= {
                  props.mode !== 'hospital' || hosItem.type === 'data'
                }                
                placeholder="请您填入您对病情的描述"
                value={hosItem.TreatmentRecord}
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
                disabled= {
                  props.mode !== 'hospital' || hosItem.type === 'data'
                }
                style={{ width: '100%' }} 
                placeholder='请对症开药'
                value={hosItem.medicine.length > 0 && hosItem.medicine.split(',').length > 0 ?hosItem.medicine.split(',') : []}
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
                Array.isArray(hosItem.assays) && hosItem.assays.map(assayItem => {
                    return (
                    <Row key={assayItem.assayId} justify='space-between' className="workTable-formCol">
                        <Col>
                          <span style={{paddingRight: '10px'}} className="workTable-label">选择检查项目：</span>
                          <Select 
                          style ={{ width: 160 }} 
                          disabled= {
                            props.mode !== 'hospital' || hosItem.type === 'data'
                          }
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
                          disabled= {
                            props.mode !== 'hospital' || hosItem.type === 'data'
                          }
                          value={assayItem.examinationResult}
                          onChange={(e)=> {
                            assayInputChange(e.target.value, hosItem.HospitalizationId, assayItem.assayId);
                          }}></Input>
                        </Col>
                        <Col>
                          <Button type='primary' 
                          disabled= {
                            props.mode !== 'hospital' || hosItem.type === 'data'
                          }
                          onClick={() => {
                            handleAddAssay(hosItem.HospitalizationId)
                          }}>添加</Button>
                          {
                            hosItem.assays.length > 1 ?  <Button type='danger' 
                            disabled= {
                              props.mode !== 'hospital' || hosItem.type === 'data'
                            }
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

const mapStateToProps = (state: { patientCase: any; }) => {
  return {
    patientCaseInfo: state.patientCase
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (patientCaseInfo: any, HosId: any, mode: string) => {
      dispatch(updateHospitalInfo(patientCaseInfo, HosId, mode))
    },
    updatePatientAssay: (patientCaseInfo: any ,HosId: any, assayId: any, mode: any) => {
      dispatch(updateHospitalAssay(patientCaseInfo, HosId, assayId, mode))
    },
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocterWorkTable)
);