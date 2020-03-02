
import {get, post} from '../common/client';

const departmentlient =  {
  getdepartments() {
    return get('/department');
  },
};

export default departmentlient;