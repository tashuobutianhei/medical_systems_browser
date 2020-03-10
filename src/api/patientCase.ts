
import {get, post} from '../common/client';

const patientCaseClient =  {
  getPatientCaseById(params) {
    return get('/patientCase', params);
  },
  setPatientCaseModeDoctor(params) {
    return post('/patientCase/doctor', params);
  },
  getAssayById(params) {
    return get('/patientCase/assay', params);
  }
};

export default patientCaseClient;