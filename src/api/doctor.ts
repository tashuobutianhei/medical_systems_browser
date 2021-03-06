
import {get, post} from '../common/client';

const doctorClient =  {
  getDoctors(params:any) {
    return get('/doctor',params);
  },
  createWorkList(departmentId: string | number) {
    return get('/schedule/createWork',{
      departmentId
    })
  },
  getScheduleList(date: string, departmentId: string) {
    return get('/schedule',{
      date,
      departmentId
    })
  },
  addSchedule(data:any) {
    return post('/schedule',data);
  },
  deleteSchedule(data:any) {
    return post('/schedule', data, 'delete');
  },
  getScheduleOfPeriod(departmentId: string | number) {
    return get('/schedule/getScheduleOfPeriod',{
      departmentId
    })
  },
  getScheduleToday() {
    return get('/schedule/today');
  }
};

export default doctorClient;