import React, { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CONST from '../../common/const';
import { Input, Select, Button, Row, Col, Switch, message } from 'antd';
import patientCaseClient from '../../api/patientCase';

import 'antd/dist/antd.css'
import './index.scss'

const { TextArea } = Input;
const { Option } = Select;

type Props = {
  patientCase: any,
  examination: any,
}

type assayType = {
  assayId: number,
  examinationId: number,
  examinationResult: string
}

function DocterWorkTable (props: Props & RouteComponentProps) {

  const [mode, setMode] = useState<string>('');
  const [patientCase, setPatientCase] = useState<any>({});
  const [assay, setAssay] = useState<assayType[]>([{
    assayId: 0,
    examinationId: 0,
    examinationResult: ''
  }]);
  const [docterView, setDocterView] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [medicine, setMedicine] = useState<string>('');
  const [Hospitalization, setHospitalization] = useState<boolean>(false);

  useEffect(() => {
    if(props.patientCase) {
      let caseId;
      if(Object.keys(props.match.params).indexOf('caseId') > -1) {
        caseId = props.match.params
      }
      setPatientCase(Array.isArray(props.patientCase) && props.patientCase.find(item => 
          item.caseId === caseId.caseId
      ) || {})
    } 
  }, []);

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
      setMode(modeString);      
      if(modeString === 'patient' || modeString === 'mhospitalodeString') {
        initHooksVal(patientCase);
      }
    }
  }, [patientCase])


  const initHooksVal = async (patientCase) => {
    setDocterView(patientCase.docterView);
    setResult(patientCase.result);
    setMedicine(patientCase.medicine ? patientCase.medicine.split(','): patientCase.medicine);
    setHospitalization(patientCase.HospitalizationId == '0' ? true : false);


    const assayIds:any = await patientCaseClient.getAssayById({
      'assayIds' : patientCase.assayId.split(',').filter(item => item != '').join(','),
    })

    if (assayIds.code === 0) {
      setAssay(Array.isArray(assayIds.data) ? assayIds.data.map(item => {
        return {
          'assayId': item.assayId,
          'examinationId': item.assayName,
          'examinationResult': item.assayResult,
        }
      }) : [{
        assayId: 1,
        examinationId: 0,
        examinationResult: ''
      }])
    } else {
      message.error({
        content: '服务错误',
      })
    }
  };

  const handleAddAssay = () => {
    let id = assay.length + 1;
    setAssay([...assay, {
      assayId: id,
      examinationId: 0,
      examinationResult: ''
    }])
  }

  const handleDeleteAssay = (assayId: number) => {
    let midAssay = assay;
    setAssay(midAssay.filter(item => {
      return item.assayId !== assayId;
    }))
  }


  const assaySelectChange = (val: any, assayId: number) => {
    setAssay(assay.map(item => {
      if(item.assayId === assayId) {
        return {
          ...item,
          examinationId: val
        }
      } else {
        return item
      }
    }))
  }

  const assayInputChange = (val: any, assayId: number) => {
    setAssay(assay.map(item => {
      if(item.assayId === assayId) {
        return {
          ...item,
          examinationResult: val
        }
      } else {
        return item
      }
    }))
  }

  const FormChangeHandle = (key: string, value: any) => {
    switch (key) {
      case 'docterView':
        setDocterView(value);
        break;
      case 'result': 
        setResult(value);
        break;
      case 'medicine': 
        setMedicine(value);
        break;
      case 'Hospitalization': 
        setHospitalization(value);
        break;
      default:
        break;
    }
  }

  const clickOk = async () => {
    let caseId;
    if(Object.keys(props.match.params).indexOf('caseId') > -1) {
      caseId = props.match.params
      
      const res:any = await patientCaseClient.setPatientCaseModeDoctor({
        docterView,
        result,
        medicine,
        Hospitalization,
        'caseId': caseId.caseId,
        assay: JSON.stringify(assay),
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
            value={docterView}
            onChange={(val) => {
              FormChangeHandle('docterView', val.target.value);
            }}></TextArea>
          </div>
        </div>
      </div>
      <div className="workTable-row">
        <div className="workTable-col">
          <span className="workTable-label">化验结果:</span>
          <div className="workTable-formItem">
            {
             assay.map(assayItem => {
                return (
                <Row key={assayItem.assayId} className="workTable-formCol" justify='space-around'>
                    <Col>
                      <span style={{paddingRight: '10px'}}>选择检查项目：</span>
                      <Select 
                      style ={{ width: 160 }} 
                      disabled={mode !== 'doctor'}
                      value={ assayItem.assayId}
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
              value={result}
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
              value={medicine}
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
                checked={Hospitalization}
                onChange={(val) => {
                  FormChangeHandle('Hospitalization', val);
                }}></Switch>
              </Col>
          </Row>
        </div>
      </div>

      <div className="workTable-col">
        <Button type='primary' 
        onClick={clickOk}
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

export default withRouter(DocterWorkTable);