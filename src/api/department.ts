
import {get, post} from '../common/client';

const departmentlient =  {
  getdepartments() {
    return get('/department');
  },
  getExamination() {
    return get('/department/examination');
  }
};

export default departmentlient;