
type assayType = {
  assayId: number,
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
}

type patientCase = {
  docterView: string,
  result: string
  medicine: string
  Hospitalization: boolean
  assay: assayType[]
  hospitalList?: hospitalType[]
}

export const resetPatient = () => {
  return {
    type: 'RESRT',
  }
}

export const updatePatient = (patientCaseInfo: any) => {
  return {
      type: 'UPDATE_PATIENT_INFO',
      patientCaseInfo
  }
}

export const updatePatientAssay = (patientCaseInfo: any, assayId: any, mode: string) => {
  return {
      type: 'UPDATE_PATIENT_ASSAY',
      patientCaseInfo,
      assayId,
      mode
  }
}

export const updateHospitalInfo = (patientCaseInfo: any, hosId: any, mode: string) => {
  return {
      type: 'UPDATE_HOSPITAL_INFO',
      patientCaseInfo,
      hosId,
      mode
  }
}

export const updateHospitalAssay = (patientCaseInfo: any, hosId: any, assayId: any, mode: string) => {
  return {
      type: 'UPDATE_HOSPITAL_ASSAY',
      patientCaseInfo,
      hosId,
      assayId,
      mode
  }
}