export type doctorInfo = {
    workerId: string
    password: string
    name: string
    sex: string
    age: number
    idCard: string
    tel: string
    address: string
    information: string // 自我描述
    position: string // 职位
    university: string // 毕业大学
    department: number // 科室
}

// 排班计划
type doctorWork = {
    data: string // 日期
    shifts: number // 0:早班 1:下午班 2:急诊
    doctors: doctorInfo[]
}

// 科室信息
type department = {
    departmentId: number
    departmentName: string
    information: string
    doctorList: doctorInfo[]
    doctorWork: doctorWork[]
}

