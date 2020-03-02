
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

  getUser() {
    return get('/users/getUser');
  }

};

export default userClient;