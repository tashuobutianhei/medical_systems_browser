
import {get, post} from '../common/client';

const adminClient =  {
  getDepartmentExpendDoctor() {
    return get('/admin/department');
  },
  addDepartment(data) {
    return post('/admin/department', data);
  },
  addDoctor(data) {
    return post('/admin/doctors', data);
  },
  outDoctor(data) {
    return post('/admin/doctors', data, 'delete');
  },  
  deleteDepartment(data) {
    return post('/admin/department', data, 'delete');
  }
};

export default adminClient;