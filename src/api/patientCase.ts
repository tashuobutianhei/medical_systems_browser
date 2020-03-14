
import {get, post} from '../common/client';

const patientCaseClient =  {
  getPatientAll() {
    return get('/patientCase/all');
  },
  getPatientCaseById(params) {
    return get('/patientCase', params);
  },
  setPatientCaseModeDoctor(params) {
    return post('/patientCase/doctor', params);
  },
  setPatientCaseModeHos(params) {
    return post('/patientCase/hospital', params);
  },
  getAssayById(params) {
    return get('/patientCase/assay', params);
  }
};

export default patientCaseClient;