
import {get, post} from '../common/client';

// type login = (username: string, password: string) => new Promise<T>()

const orderClient =  {
  findOrder(params) {
    return get('/order', {
      ...params
    });
  },
  order(params) {
    return post('/order', {
      ...params
    });
  }
};

export default orderClient;