import React from 'react'
import HomeEnterCrad from '../../component/HomeEnterCrad'

import 'antd/dist/antd.css'
import './index.scss'

type Props = {
  color: string
  imgUrl: string
  enterText: string
  textColor: string
  auth: boolean
  type: number
  path: string
  toggleModalVisable?: (status: boolean) => void
}


type PatientType = {
  user: any
  onLogin(userInfo: any): void
}

const homeList: Props[] = [{
  color: '#62999d',
  imgUrl: 'patient',
  enterText: '患者端',
  textColor: 'white',
  auth: false,
  type: 1,
  path: 'Patient',
}, {
  color: '#dac594',
  imgUrl: 'docter',
  enterText: '医生端',
  textColor: 'white',
  auth: true,
  type: 2,
  path: 'Doctor',
}, {
  color: '#fff',
  imgUrl: 'manager',
  enterText: '管理端',
  textColor: 'black',
  auth: true,
  type: 0,
  path: 'Manager',
}]


function Home (props: PatientType) {
  return (
    <>

    <div className="modal"> </div>
    <div className="home">
      <div className="home-tilte">
        <img src='/img/logo.png'></img>
        <p className="home-tilte-text"></p>
      </div>
      <div className="home-body">
        {homeList.map((item, index) => (
          <HomeEnterCrad {...item} key = {index}/>
        ))}
      </div>

    </div>
    </>
  )
}

export default Home;
