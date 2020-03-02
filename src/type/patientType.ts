// 用户信息
export type patientInfo = {
    uid: string //
    username: string
    password: string

    name: string
    idcard: string
    sex: number
    age: number
    tel: string
    address?: string
}

// 病例
type patientCase = {
    uid: string // 用户
    caseId: string
    docterId: string // 诊治医生
    registerDate: string // 病例日期
    describe: string // 患者描述
    docterView: string // 医生检查描述
    assay: [ // 化验信息
        {
            assayName: string, // 化验名称
            assayResult: string // 化验结果
        }
    ]
    result: string // 诊断结果
    medicine: string[] // 药物
    HospitalizationId: string
}

// 住院日常检查
type hospitalizationInfoList = {
    date: string, // 检查日期
    patientStatus: string, // 病人状态
    medicine: string, // 药物
    TreatmentRecord: string // 诊治记录
    recovery: number // 是否康复可以出院
}

// 住院信息
type hospitalization = {
    HospitalizationId: string;
    hospitalizationInfoList: hospitalizationInfoList[];
}

