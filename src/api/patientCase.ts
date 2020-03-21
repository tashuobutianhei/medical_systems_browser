
import {get, post} from '../common/client';

const patientCaseClient =  {
  // 获取所有病例
  getPatientAll() {
    return get('/patientCase/all');
  },
  // 根绝医生工号查找病例
  getPatientCaseById(params) {
    return get('/patientCase', params);
  },
  // 诊断模式下病例
  setPatientCaseModeDoctor(params) {
    return post('/patientCase/doctor', params);
  },
  // 住院模式下病例
  setPatientCaseModeHos(params) {
    return post('/patientCase/hospital', params);
  },
  // 获取化验记录
  getAssayById(params) {
    return get('/patientCase/assay', params);
  },
  // 获取该患者所有病例
  getPatientCaseUser() {
    return get('/patientCase/patient');
  }
};

export default patientCaseClient;