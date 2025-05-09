import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { GetProfileRes, UserLoginRes, UserLoginReq, MarkAttendance, GetAttendanceRes, DeleteProfilePicReq, deleteProfilePicRes, ForgotPasswordReq, ForgotPasswordRes, ResetPasswordReq, ResetPasswordRes } from "types/User";

function logoutService() {

}

function loginService(data: UserLoginReq) {
    return apiService.post<UserLoginRes>(
        API_ENDPOINTS.login,
        data
    );
}

function forgotPasswordService(data: any) {
    return apiService.post<ForgotPasswordRes>(
        API_ENDPOINTS.forgotPassword,
        data
    );
}

function resetPasswordService(data: ResetPasswordReq) {
    return apiService.post<ResetPasswordRes>(
        API_ENDPOINTS.resetPassword,
        data
    );
}


function getProfileService() {
    return apiService.get<GetProfileRes>(
        API_ENDPOINTS.getProfile
    );
}

function uploadProfilePictureService(reqBody: any) {
    return apiService.put<any>(
        API_ENDPOINTS.uploadProfilePicture, reqBody
    );
}

function deleteProfilePicService(empId: DeleteProfilePicReq) {
    return apiService.put<deleteProfilePicRes>(
        `${API_ENDPOINTS.deleteProfilePic}/${empId}`
    );
}

function markAttendance(data: MarkAttendance) {
    return apiService.post<any>(
        API_ENDPOINTS.markAttendance,
        data
    );
}

function getAttendanceList(empId: string) {
    return apiService.get<GetAttendanceRes>(
        `${API_ENDPOINTS.getAttendanceList}/${empId}`
    );
}
function getAttendanceReport(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<GetAttendanceRes>(API_ENDPOINTS.getAttendanceReport, { params } );
}



function getCheckInOutTime() {
    return apiService.get<any>(
        API_ENDPOINTS.getAttendanceInOut
    );
}

// home page

function getHomeTodayAchievement() {
    return apiService.get<any>(
        API_ENDPOINTS.getHomeTodayAchievement
    );
}
function getHomeTodayOrderValue() {
    return apiService.get<any>(
        API_ENDPOINTS.getHomeTodayOrderValue
    );
}
function getHomeMonthAchievement() {
    return apiService.get<any>(
        API_ENDPOINTS.getHomeMonthAchievement
    );
}
export {
    logoutService,
    loginService,
    getProfileService,
    markAttendance,
    getAttendanceList,
    getCheckInOutTime,
    uploadProfilePictureService,
    deleteProfilePicService,
    forgotPasswordService,
    resetPasswordService,
    getAttendanceReport,

    getHomeTodayAchievement,
    getHomeTodayOrderValue,
    getHomeMonthAchievement
}