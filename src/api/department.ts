
import {get, post} from '../common/client';

const departmentlient =  {
  getdepartments(params: any = {}) {
    return get('/department', params);
  },
  getExamination() {
    return get('/department/examination');
  }
};

export default departmentlient;