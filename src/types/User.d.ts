import { ExpenseReportClaimType, UserRole } from "enum/common";
import { IApiResponse } from "./Common";
import { usersActionsType } from "redux-store/action-type/usersActionsType";

export type UserLoginReq = {
  phone: number;
  password: string;
}

export type UserLoginRes = IApiResponse<{
  accessToken: string;
}>

export type ForgotPasswordReq = {
  email: string;
}

export type ForgotPasswordRes = IApiResponse<{
  message: string;
}>


export type ResetPasswordReq = {
  password: string;
  confirmPassword: string;
  empId: number;
}

export type ResetPasswordRes = IApiResponse<{
  message: string;
}>

export type UserData = {
  id: number
  emp_id: any
  name: string
  emailId: string
  contactNumber: string
  manager: string
  address: string
  city: string
  state: string
  pincode: string
  zone: string
  joiningDate: string
  isCheckInMarked: boolean
  isCheckOutMarked: boolean
  role: UserRole
  image: string
}

export type GetProfileRes = IApiResponse<UserData>

export type UserDetails = {
  emp_id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  managerId: number
  manager: string
  address: string
  city: string
  state: string
  pincode: string
  zone: string
  joining_date: string
  role: UserRole
  age: string
  password: role
  dob: string
}

export type GetUserRes = IApiResponse<UserDetails>
export type MarkAttendance = {
  inTime?: string;
  outTime?: string;
}

export type AttendanceData = {
  attendanceId: number
  empId: number
  checkIn: string
  checkOut: string
  createdAt: string
  updatedAt: string
  duration: any
}

export type GetAttendanceRes = IApiResponse<AttendanceData>

export type DeleteProfilePicReq = {
  id: number;
}

export type deleteProfilePicRes = IApiResponse<{
  message: string;
}>


export type UserSSMData = {
  emp_id: number
  firstname: string
  lastname: string
  role?: string
  zone?: string
  manager?: string
  name?: string
}

export type GetSSMUsersRes = IApiResponse<UserSSMData>

export type UserLearningRoleData = {
  learningRole: string
}
export type GetUserLearningRoleRes = IApiResponse<UserLearningRoleData>


export type CreateUserReq = {
  firstname: string
  lastname: string
  email: string
  password: string
  address: string
  city: string
  state: string
  pincode: string
  age: number
  zone: string
  phone: string
  joining_date: date
  managerId: number
  role: string
  learningRole: string
  dob: Date
}
export type CreateUserRes = IApiResponse<{
  status: number;
  message: string;
}>
export interface IUsersReducer {
  usersSSM: UserSSMData[];
  usersLearningRole: UserLearningRoleData[];
  userManager: UserSSMData[];
}

export interface ISetSSMUsersAction {
  type: usersActionsType.GET_SSM_USERS;
  payload: UserSSMData[];
}

export interface ISetManagerAction {
  type: usersActionsType.GET_MANAGER;
  payload: UserSSMData[];
}
export interface ISetUsersLearningRoleAction {
  type: usersActionsType.GET_USERS_LEARNING_ROLE;
  payload: UserLearningRoleData[];
}

export type IUsersReducerAction = ISetSSMUsersAction | ISetManagerAction | ISetUsersLearningRoleAction;

export type DeleteUserReq = {
  empId: number;
}

export type deleteUserRes = IApiResponse<{
  message: string;
}>

export type UpdateUserReq = {
  empId: number
  firstname: string
  lastname: string
  email: string
  phone: string
  managerId: number
  role: string
  age: number
  address: string
  city: string
  state: string
  pincode: string
  zone: string
  joining_date: string
  learningRole?: any
  dob: Date
}

export type UpdateUserRes = IApiResponse<{
  status: number;
  message: string;
}>

// Feature


export interface Feature {
  featureId: number;
  empId: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddFeatureReq = {
  name: string;
  isActive: boolean
}

export type AddFeatureRes = IApiResponse<{
  message: string;
}>

export type UpdateFeatureReq = {
  key: string;
  isActive: boolean;
}

export type UpdateFeatureRes = IApiResponse<{
  message: string;
}>


export type DeleteFeatureReq = {
  featureId: number;
}

export type deleteFeatureRes = IApiResponse<{
  message: string;
}>

export interface IFeatureData {
  featureId: number
  name: string
}

export type IFeatureRes = IApiResponse<IFeatureData>;

//   Role

export interface role {
  roleId: number;
  empId: number;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddRoleReq = {
  name: string;
}

export type AddRoleRes = IApiResponse<{
  message: string;
}>

export type UpdateRoleReq = {
  roleId: number;
  name: string
}

export type UpdateRoleRes = IApiResponse<{
  message: string;
}>


export type DeleteRoleReq = {
  roleId: number;
}

export type deleteRoleRes = IApiResponse<{
  message: string;
}>

export interface IRoleData {
  roleId: number
  name: string
}

export type IRoleRes = IApiResponse<IRoleData>;

export type UserImportData = {
  id: number
  emp_id: any
  firstname: string
  lastname: string
  email: string
  phone: string
  manager: string
  address: string
  zone: string
  joining_date: string
  password: string
  dob:string
  managerId:number
  age: number
  // isCheckOutMarked: boolean
  role: UserRole
  city: string
  state: string
  pincode: string
  // image: string
  learningRole:any
}



// Policy Head
export interface IPolicyHead {
  policy_id: number;
  policy_name: string
  is_travel?: boolean
  policy_code: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type AddPolicyHeadReq = {
  policy_name: string;
  is_travel: boolean;
  policy_code: string;
}

export type AddPolicyHeadRes = IApiResponse<{
  message: string;
}>

export type UpdatePolicyHeadReq = {
  policy_name: string;
  policy_id: number;
  is_travel: boolean;
  policy_code: string;
}

export type UpdatePolicyHeadRes = IApiResponse<{
  message: string;
}>


export type DeletePolicyHeadReq = {
  policy_id: number;
  is_travel: boolean;
  policy_code: string;
}

export type deletePolicyHeadRes = IApiResponse<{
  message: string;
}>

export interface IPolicyHeadData {
  policy_id: number;
  policy_name: string
  is_travel?: boolean
  policy_code: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type IPolicyHeadDataRes = IApiResponse<IPolicyHeadData>;

// Policy Type
export interface IPolicyType {
    policy_type_id: number;
    policy_type_name: string;
    policy_id: number;
    from_date: Date;
    to_date: Date;
    claim_type: ExpenseReportClaimType;
    cost_per_km: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export type AddPolicyTypeReq = {
  policy_type_name: string;
  cost_per_km?: number | null
  from_date?: date | null;
  to_date?: date | null;
  claim_type: ExpenseReportClaimType
  policy_id: string;

}

export type AddPolicyTypeRes = IApiResponse<{
  message: string;
}>

export type UpdatePolicyTypeReq = {
  policy_type_id: string;
  policy_id: number;
  policy_type_name: string;
  // from_date: date;
  claim_type: ExpenseReportClaimType;
  // to_date: date;
  cost_per_km: number;

}

export type UpdatePolicyTypeRes = IApiResponse<{
  message: string;
}>


export type DeletePolicyTypeReq = {
  policy_type_id: number;
  policy_id: number;
  is_travel: boolean;
  policy_code: string;
}

export type deletePolicyTypeRes = IApiResponse<{
  message: string;
}>

export interface IPolicyTypeData {
  policy_type_id: number;
  policy_type_name: string;
  policy_id: number;
  from_date: Date;
  to_date: Date;
  claim_type: ExpenseReportClaimType;
  cost_per_km: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type IPolicyTypeDataRes = IApiResponse<IPolicyTypeData>;

// Expense Management
export interface IExpense {
  expence_id: number;
  claim_type: ExpenseReportClaimType;
  from_date: Date;
  to_date: Date;
  policy_id: number;
  policy_type_id: number;
  report_to: number;
  submitted_by: number;
  from_location: string;
  to_location: string;
  kms: number;
  total_expence: number;
  detail: string;
  remark: string;
  report_status: ExpenseReportStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type AddExpenseReq = {
  // claim_type: ExpenseReportClaimType;
  from_date: Date;
  to_date: Date;
  policy_id: number;
  policy_type_id?: number | null;
  // report_to: number;
  // submitted_by: number;
  from_location: string;
  to_location: string;
  kms: number;
  total_expence: number;
  detail: string;
}

export type AddExpenseRes = IApiResponse<{
message: string;
}>

export type UpdateExpenseReq = {
  expence_id: number;
  report_status: string;
  remark: string;
  // leave_app_id: number;
  // leave_app_status: string;
  // remarks: string;
}

export type UpdateExpenseRes = IApiResponse<{
message: string;
}>


export type DeleteExpenseReq = {
  policy_id: number;
}

export type deleteExpenseRes = IApiResponse<{
message: string;
}>

export interface IExpenseData {
  expence_id: number;
  claim_type: ExpenseReportClaimType;
  from_date: Date;
  to_date: Date;
  policy_id: number;
  policy_type_id: number;
  report_to: number;
  submitted_by: number;
  from_location: string;
  to_location: string;
  kms: number;
  total_expence: number;
  detail: string;
  remark: string;
  report_status: ExpenseReportStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type IExpenseDataRes = IApiResponse<IExpenseData>;


// Leave head
export interface IHeadLeave {
  head_leave_id: number;
  head_leave_code: string;
  head_leave_short_name: string;
  head_leave_name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export type AddLeaveHeadReq = {
  head_leave_name: string;
  head_leave_short_name: string;
  status: boolean;
}

export type AddLeaveHeadRes = IApiResponse<{
message: string;
}>

export type UpdateLeaveHeadReq = {
  head_leave_id: number;
  head_leave_name?: string;
  head_leave_short_name?: string;
  status?: boolean;

}

export type UpdateLeaveHeadRes = IApiResponse<{
message: string;
}>


export type DeleteLeaveHeadReq = {
  head_leave_id: number;
}

export type deleteLeaveheadRes = IApiResponse<{
message: string;
}>

export interface ILeaveHeadData {
  head_leave_id: number;
  head_leave_code: string;
  head_leave_short_name: string;
  head_leave_name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  deletedAt?: Date;
}

export type ILeaveHeadDataRes = IApiResponse<ILeaveHeadData>;


// Leave Count

export interface ILeaveHeadCount {
  headLeaveCntId: number;
  headLeaveId: number;
  financialStart: Date;
  financialEnd: Date;
  totalHeadLeave: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LeaveHeadCountReq = {
  headLeaveId: number;
  financialStart: date;
  financialEnd: date;
  totalHeadLeave: number;
  // status: boolean;
}

export type AddLeaveHeadCountRes = IApiResponse<{
message: string;
}>

export type UpdateLeaveHeadCountReq = {
  headLeaveId?: number;
  headLeaveCntId?: number;

  // financialStart: date;
  // financialEnd: date;
  totalHeadLeave: number;
  // status: boolean;

}

export type UpdateLeaveHeadCountRes = IApiResponse<{
message: string;
}>


export type DeleteLeaveHeadCountReq = {
  headLeaveCntId: number;
}

export type deleteLeaveHeadCountRes = IApiResponse<{
message: string;
}>

export interface ILeaveHeadCountData {
  left_leave(left_leave: any): string | undefined;
  headLeaveCntId: number;
  headLeaveId: number;
  financialStart: Date;
  financialEnd: Date;
  totalHeadLeave: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ILeaveHeadCountDataRes = IApiResponse<ILeaveHeadCountData>;

export type AddLeaveApplicationReq = {
  head_leave_id: number;
  head_leave_cnt_id: number;
  from_date: date;
  to_date: date;
  no_of_days: number;
  reason: string;
  // status: boolean;
}

export type AddLeaveApplicationRes = IApiResponse<{
message: string;
}>

export interface ILeaveApplicationData {
  head_leave_id: number;
  head_leave_cnt_id: number;
  from_date: date;
  to_date: date;
  no_of_days: number;
  reason: string;
}

export type AddHolidayApplicationReq = {
  name: string;
  date: date;
  day: string;
}

export type ILeaveApplicationRes = IApiResponse<ILeaveApplicationData>;

export type AddHolidayApplicationRes = IApiResponse<{
  message: string;
  }>

export type UpdateLeaveAppReq = {
  leave_app_id: number;
  leave_app_status: string;
  remarks: string;
}

// Define IHolidayApplicationData
export interface IHolidayApplicationData {
  holidayid: number;
  name: string;
  date: date;
  day: string;
}

// Define IHolidayApplicationRes
export type IHolidayApplicationRes = IApiResponse<IHolidayApplicationData>;

export type UpdateLeaveAppRes = IApiResponse<{
message: string;
}>