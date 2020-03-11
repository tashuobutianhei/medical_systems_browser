
import randomString from 'random-string';

type assayType = {
  assayId: number | string,
  examinationId: number | null,
  examinationResult: string
}

type hospitalType = {
  HospitalizationId: string | number,
  assays: assayType[],
  patientStatus: string,
  medicine: string,
  TreatmentRecord: string,
  recovery: string,
  date: Date
  type: string,
}

type patientCase = {
  docterView: string,
  result: string
  medicine: string
  Hospitalization: boolean
  assay: assayType[]
  hospitalList?: hospitalType[]
}


const patientCaseState: patientCase = {
  docterView: '',
  result: '',
  medicine: '',
  Hospitalization: false,
  assay: [{
    'assayId': 0,
    'examinationId': null,
    'examinationResult': '',
  }],
  hospitalList: [{
    HospitalizationId: '0',
    assays: [{
      assayId: 0,
      examinationId: null,
      examinationResult: ''
    }],
    patientStatus: '',
    medicine: '',
    TreatmentRecord: '',
    recovery: '0',
    date: new Date(),
    type: 'set'
  }]
}



const patientCase = (state = patientCaseState, action) => {
  switch (action.type) {
    case 'RESRT':
      return patientCaseState;
    case 'UPDATE_PATIENT_INFO':
      return {
        ...state,
        ...action.patientCaseInfo
      }
    case 'UPDATE_PATIENT_ASSAY':
      let assay = state.assay;
      switch (action.mode) {
        case 'add':
          let id = assay.length + 1;
          assay = [...assay, {
            assayId: id,
            examinationId: null,
            examinationResult: ''
          }]
          break;
        case 'delete':
          assay = assay.filter(item => {
            return item.assayId !== action.assayId;
          });
          break;
        case 'update':
          assay = assay.map(item => {
            if(item.assayId === action.assayId) {
              return {
                ...item,
                ...action.patientCaseInfo
              }
            }
            return item;
          })
          break;
        case 'set':
          assay = action.patientCaseInfo
          break;
        default:
          break;
      }
      return {
        ...state,
        'assay': assay
      }
    case 'UPDATE_HOSPITAL_INFO':
      let hospitalListA = state.hospitalList;
      switch (action.mode) {
        case 'add':
          let id = randomString({length: 12, numbers: true});
          hospitalListA = [...hospitalListA, {
            HospitalizationId: id,
            assays: [{
              assayId: 0,
              examinationId: null,
              examinationResult: ''
            }],
            patientStatus: '',
            medicine: '',
            TreatmentRecord: '',
            recovery: '',
            date: new Date(),
            type: 'set'
          }]
          break;
        case 'update':
          hospitalListA = state.hospitalList.map(item => {
              if(item.HospitalizationId === action.hosId) {
                return {
                  ...item,
                  ...action.patientCaseInfo
                }
              }
              return item;
            })
          break;
        case 'set':
          hospitalListA = action.patientCaseInfo.length > 0 ? 
          action.patientCaseInfo.length : hospitalListA;
          break;
        default:
          break;
      }
      return {
        ...state,
        'hospitalList': hospitalListA
      }
    case 'UPDATE_HOSPITAL_ASSAY':
      let hospitalListB = state.hospitalList;
      switch (action.mode) {
        case 'add':
          hospitalListB = hospitalListB.map(item => {
            if(item.HospitalizationId === action.hosId) {
              return {
                ...item,
                assays: [...item.assays, {
                  'assayId': randomString({length: 12, numbers: true}),
                  'examinationId': null,
                  'examinationResult': ''
                }]
              }
            }
            return item;
          })
          break;
        case 'delete':
          hospitalListB = hospitalListB.map(item => {
            if(item.HospitalizationId === action.hosId) {
              return {
                ...item,
                assays: item.assays.filter(item => {
                  return item.assayId !== action.assayId;
                })
              }
            }
            return item;
          });
          break;
        case 'update':
          hospitalListB = hospitalListB.map(item => {
            if(item.HospitalizationId === action.hosId) {
              return {
                ...item,
                assays: item.assays.map(item => {
                  return {
                    ...item,
                    ...action.patientCaseInfo
                  }
                })
              }
            }
            return item;
          });
          break;
        case 'set':
          hospitalListB = hospitalListB.map(item => {
            return {
              ...item,
              assays: action.patientCaseInfo
            }
          })
          break;
        default:
          break;
      }
      return {
        ...state,
        'hospitalList': hospitalListB
      }
    default:
      return state
  }
}

export default patientCase

