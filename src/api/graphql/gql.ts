import { gql } from 'apollo-boost'

export const fetchInfoALLGQL = gql`
  query {
    Info{
    departmentInfoList {
      departmentId,
      departmentName,
      information,
      doctorList {
          workerId
          name
          sex
          age
          idcard
          tel
          address
          information
          position
          university
          departmentId
          status
          avatar
      }
    }
      examiation {
        examinationName
        examinationId
        examinationDesc
      }
    } 
  }
`

export const fetchInfoByIDGQL = (departmentId) => {
  return `
  query {
    Info(departmentId:${departmentId}){
    departmentInfoList {
      departmentId,
      departmentName
    }
      examiation {
        examinationName
      }
    } 
  }
  `
}
