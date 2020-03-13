
import {get, post} from '../common/client';

const adminClient =  {
  getDepartmentExpendDoctor() {
    return get('/admin/department');
  },
  addDepartment(data) {
    return post('/admin/department', data);
  },
  addDocter(data) {
    return post('/admin/docters', data);
  },
  outDocter(data) {
    return post('/admin/docters', data, 'delete');
  },  
  deleteDepartment(data) {
    return post('/admin/docters', data, 'delete');
  }
};

export default adminClient;