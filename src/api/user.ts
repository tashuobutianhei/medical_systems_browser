
import {get, post} from '../common/client';

// type login = (username: string, password: string) => new Promise<T>()

const userClient =  {
  login(username: string, password: string, userType: number) {
    return post('/users/login', {
        username,
        password,
        userType
    })
  },
  register(data) {
    return post('/users/register', {
      ...data
    });
  },
  getUser() {
    return get('/users/getUser');
  },
  updata(data) {
    return post('/user', data, 'PUT');
  }
};

export default userClient;