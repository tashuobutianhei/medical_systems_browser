
import {get, post} from '../common/client';

// type login = (username: string, password: string) => new Promise<T>()

type loginPassword= {
  username: string
  password: string
  captcha: string | number
}

type loginTel= {
  tel: string
  captcha: string | number
}

const userClient =  {
  // loginType 0:密码登陆， 1短信验证码
  login(userInfo : loginPassword | loginTel, userType: number, loginType: number = 0) {
    return post('/users/login', {
        userInfo: JSON.stringify(userInfo),
        loginType,
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
    return post('/users', data, 'PUT');
  },
  getcaptcha() {
    return get('/users/captcha');
  },
  checkUserInfo(params:{key: string, value: string}) {
    return get('/users/checkUserInfo', params);
  }
};

export default userClient;