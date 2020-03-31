
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
  },
  getPatient(params: {userInfo?: any, page?: number, size?: number} = {
    page: 1,
    size: 20,
    userInfo: undefined
  }) {
    return get('/admin/user', params);
  },
  getCommonInfo() {
    return get('/admin/info');
  },
  updateCommonInfo(data:{
    type: string,
    data: any
  }) {
    return post('/admin/info', data);
  },
};

export default adminClient;