
import axios from 'axios';
import Tool from '../common/util';
// import {message} from 'antd';
import jsCookie from 'js-cookie';


const client = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 2000, // request timeout
  headers: {
    // 'Content-Type': 'application/json'
  }
})

client.interceptors.request.use(function (config) {
  config.withCredentials = true;
  if (jsCookie.get('the_docters_token')) {
    config.headers = {
      "Authorization": `Bearer ${jsCookie.get('the_docters_token')}`
    }
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});


client.interceptors.response.use(
  response => {
    if(response.data.code !== 0) {
      // message.error({
      //   content: response.data.message,
      //   duration: 2,
      // });
    }
   return response
  },
  error => {
    // message.error({
    //   content: error,
    //   duration: 2,
    // });
   return Promise.reject(error)
  }
);


export function get (url: string, params?: object) {
  return new Promise((resolve,reject) => {
    client.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
      return response;
    })
    .catch(err => {
      reject(err)
    })
  })

}

export function post (url: string, data: object, method: any = 'post') {
  return new Promise((resolve,reject) => {
    client({
      method,
      url: url,
      headers: { "Content-Type": "application/x-www-from-urlencoded" },
      data: Tool.transformData(data)
    }).then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

