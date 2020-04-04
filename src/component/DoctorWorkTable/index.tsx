import React, { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CONST from '../../common/const';
import { Input, Select, Button, Row, Col, Switch, message } from 'antd';
import patientCaseClient from '../../api/patientCase';
import HospitalLIst from '../HospitalLIst';
import { updatePatient, updatePatientAssay } from '../../action/patientCase';

import 'antd/dist/antd.css'
import './index.scss'
import { connect } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;

type Props = {
  patientCase: any,
  examination: any,
  updatePatient: any,
  updatePatientAssay: any
  patientCaseInfo: any
  which? : string
}

type assayType = {
  assayId: number,
  examinationId: number,
  examinationResult: string
}

function DoctorWorkTable (props: Props & RouteComponentProps) {

  const [mode, setMode] = useState<string>('');
  const [patientCase, setPatientCase] = useState<any>({});

  useEffect(() => {
    if(props.patientCase) {
      let caseId: { caseId?: any; };
      if(Object.keys(props.match.params).indexOf('caseId') > -1) {
        caseId = props.match.params
      }
      setPatientCase(Array.isArray(props.patientCase) && props.patientCase.find(item => 
          item.caseId === caseId.caseId
      ) || {})
    } 
  }, []);

  useEffect(() => {
    // console.log(props.patientCaseInfo)
  }, [props.patientCaseInfo])

  // 判断模式
  useEffect(() => {
    if (Object.keys(patientCase).length > 0) {
      let status = patientCase.status;
      let modeString = 'doctor'
      switch (status) {
        case 1:
          modeString = 'patient'
        break;
        case 3:
          modeString = 'patient'
        break;
        case 2:
          modeString = 'hospital'
        break;
        default:
          break;
      }
      if (props.which === 'patient') {
        modeString = 'patient'
      }
      setMode(modeString);      
      if(modeString === 'patient' || modeString === 'hospital') {
        initHooksVal(patientCase);
      }
    }
  }, [patientCase])


  const initHooksVal = async (patientCase: any) => {
    props.updatePatient({
      'doctorView': patientCase.doctorView,
      'result': patientCase.result,
      'medicine': patientCase.medicine,
      'Hospitalization': patientCase.HospitalizationId == '-1' ? false : true
    })

    if (!patientCase.assayId || (patientCase.assayId && patientCase.assayId.length === 0)) {
      return;
    }
    const assayIds:any = await patientCaseClient.getAssayById({
      'assayIds' : patientCase.assayId.split(',').filter((item: string) => item != '').join(','),
    })

    if (assayIds.code === 0) {
      props.updatePatientAssay(Array.isArray(assayIds.data) ? assayIds.data.map((item: any) => {
        return {
          'assayId': item.assayId,
          'examinationId': item.assayName,
          'examinationResult': item.assayResult,
        }
      }) : [{
        assayId: 1,
        examinationId: 0,
        examinationResult: ''
      }], '', 'set');
    } else {
      message.error({
        content: '服务错误',
      })
    }
  };

  const handleAddAssay = () => {
    props.updatePatientAssay({}, '', 'add');
  }

  const handleDeleteAssay = (assayId: number) => {
    props.updatePatientAssay({}, assayId, 'delete');
  }


  const assaySelectChange = (val: any, assayId: number) => {
    props.updatePatientAssay({
      'examinationId': val
    }, assayId, 'update');
  }

  const assayInputChange = (val: any, assayId: number) => {
    props.updatePatientAssay({
      'examinationResult': val
    }, assayId, 'update');
  }

  const FormChangeHandle = (key: string, value: any) => {
    let obj = {};
    obj[key] = value;
    props.updatePatient(obj);
  }

  const postDoctor = async (caseId: any) => {
    const {doctorView, result, medicine, Hospitalization, assay} = props.patientCaseInfo;
      
    const res:any = await patientCaseClient.setPatientCaseModeDoctor({
      doctorView,
      result,
      medicine,
      'Hospitalization': Hospitalization ? 0 : -1,
      'caseId': caseId.caseId,
      assay: JSON.stringify(assay.filter(assayItem => {
        return assayItem.examinationId !== null;
      })),
    });

    if (res.code === 0) {
      message.success({
        content: '诊断成功',
      });
      props.history.push(`/Doctor/Cases/`)
    } else {
      message.error({
        content: '服务错误',
      })
    }
  }

  const postHos = async (caseId: any) => {
    const hospitalList = props.patientCaseInfo.hospitalList.filter(item => {
        return item.type === 'set';
      } 
    );

    console.log(hospitalList);
    const res:any = await patientCaseClient.setPatientCaseModeHos({
      'caseId': caseId.caseId,
      hospitalList: JSON.stringify(hospitalList),
    });

    if (res.code === 0) {
      message.success({
        content: '诊断成功',
      });
      props.history.push(`/Doctor/Cases/`)
    } else {
      message.error({
        content: '服务错误',
      })
    }
  }

  const clickOk = async () => {
    let caseId: { caseId?: any; };
    if(Object.keys(props.match.params).indexOf('caseId') > -1) {
      caseId = props.match.params
      if( mode === 'doctor') {
        postDoctor(caseId);
      } else if( mode === 'hospital') {
        postHos(caseId);
      }
    }
  }

  return (
    <div className="workTable">
      <div className="workTable-tag">
        <span>{CONST.MODE[mode]}</span>
      </div>
      <div className="workTable-title">
        <p>病例表</p>
        <p>编号:{patientCase.caseId}</p>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">姓名:</span>
          <span>{patientCase.patientInfo && patientCase.patientInfo.name}</span>
        </div>
        <div className="workTable-col">
          <span className="workTable-label">年龄:</span>
          <span>{patientCase.patientInfo && patientCase.patientInfo.age}</span>
        </div>
        <div className="workTable-col">
          <span className="workTable-label">性别:</span>
          <span>{patientCase.patientInfo && CONST.SEX[patientCase.patientInfo.sex]}</span>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">电话号码:</span><span>{patientCase.patientInfo && patientCase.patientInfo.tel}</span>
        </div>
        <div className="workTable-col">
          <span className="workTable-label">身份证号:</span>
          <span>{patientCase.patientInfo && patientCase.patientInfo.idcard}</span>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">地址:</span>
          <span>{(patientCase.patientInfo && patientCase.patientInfo.address) || '暂未填写'}</span>
        </div>
      </div>
      <div className="workTable-row"> 
        <div className="workTable-col">
          <span className="workTable-label">病人自述:</span>
          <div className="workTable-textArea">
            {patientCase.describe}
          </div>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">医生描述:</span>
          <div className="workTable-textArea">
            <TextArea 
            autoSize={false}
            rows={3} 
            allowClear={true} 
            disabled={mode !== 'doctor'}
            placeholder="请您填入您对病情的描述"
            value={props.patientCaseInfo.doctorView}
            onChange={(val) => {
              FormChangeHandle('doctorView', val.target.value);
            }}></TextArea>
          </div>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">化验结果:</span>
          <div className="workTable-formItem">
            {
              props.patientCaseInfo.assay.map(assayItem => {
                return (
                <Row key={assayItem.assayId} className="workTable-formCol" justify='space-around'>
                    <Col>
                      <span style={{paddingRight: '10px'}}>选择检查项目：</span>
                      <Select 
                      style ={{ width: 160 }} 
                      disabled={mode !== 'doctor'}
                      defaultValue={assayItem.assayId}
                      onChange={(val)=>{
                        assaySelectChange(val, assayItem.assayId);
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
                      disabled={mode !== 'doctor'} 
                      value={assayItem.examinationResult}
                      onChange={(e)=> {
                        assayInputChange(e.target.value, assayItem.assayId);
                      }}></Input>
                    </Col>
                    <Col>
                      <Button type='primary' 
                      disabled={mode !== 'doctor'} 
                      onClick={handleAddAssay}>添加</Button>
                      <Button type='danger' 
                      disabled={mode !== 'doctor'} 
                      onClick={() => {
                        handleDeleteAssay(assayItem.assayId)
                      }}>删除</Button>
                    </Col>
                </Row>
                )
                })
              }
            </div>
        </div>
      </div>
      <div>
        <div className="workTable-col">
          <span className="workTable-label">诊断结果:</span>
          <div className="workTable-textArea">
            <TextArea 
              autoSize={false}
              rows={3} 
              allowClear={true} 
              placeholder="填入诊断结果"
              disabled={mode !== 'doctor'}
              value={props.patientCaseInfo.result}
              onChange={(val) => {
                FormChangeHandle('result', val.target.value);
              }}></TextArea>
          </div>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">处方药物:</span>
          <div className="workTable-textArea" style={{display: 'inlineBlock'}}>
              <Select 
              mode="tags" 
              disabled={mode !== 'doctor'}
              style={{ width: '100%' }} 
              placeholder='请对症开药'
              value={props.patientCaseInfo.medicine}
              onChange={(val) => {
                let medicineVal = '';
                if(Array.isArray(val)) {
                  medicineVal = val.join(',');
                }
                FormChangeHandle('medicine', medicineVal);
              }}
              tokenSeparators={[',']}>
              </Select>
          </div>
        </div>
      </div>
      <div>
        <div className="workTable-col">
          <Row justify="space-between">
              <Col>
                <span className="workTable-label">是否住院:</span>
              </Col>
              <Col>
                <Switch 
                disabled={mode !== 'doctor'}
                checked={props.patientCaseInfo.Hospitalization}
                onChange={(val) => {
                  FormChangeHandle('Hospitalization', val);
                }}></Switch>
              </Col>
          </Row>
        </div>
      </div>
      {
        
        props.patientCaseInfo.Hospitalization && mode !== 'doctor' ? 
        <HospitalLIst mode={mode} examination={props.examination} hospitalList={patientCase.hostList || []}></HospitalLIst>
        : null
      }
      <div className="workTable-col">
        <Button type='primary' 
        onClick={clickOk}
        disabled={mode === 'patient'}
        style={{
          width: '100%',
          height: '40px',
          fontSize: '20px',
          fontWeight: 'bolder'
          }}>确认</Button>
      </div>
    </div>
  );
}




const mapStateToProps = (state: { patientCase: any; }) => {
  return {
    patientCaseInfo: state.patientCase
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (patientCaseInfo: any) => {
      dispatch(updatePatient(patientCaseInfo))
    },
    updatePatientAssay: (patientCaseInfo: any, assayId: any, mode: any) => {
      dispatch(updatePatientAssay(patientCaseInfo, assayId, mode))
    },
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DoctorWorkTable)
);