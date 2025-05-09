import { apiService } from "../apiService";
import { API_ENDPOINTS } from "app-constants";
import { AddCourseReq, AddCourseRes, AddQuizReq, AddQuizRes, DeleteCourseReq, DeleteCourseRes, DeleteQuizReq, deleteQuizRes, GetCourseRes, GetQuizRes, ICourseRes, IQuizRes, UpdateCourseReq, UpdateCourseRes, UpdateQuizReq, UpdateQuizRes } from "types/learningModule/Course";

function addCourseService(data: AddCourseReq) {
    return apiService.post<AddCourseRes>(
        API_ENDPOINTS.addCourse,
        data
    );
}

function getCourseService() {
    return apiService.get<GetCourseRes>(API_ENDPOINTS.getCourse);
}

function getCourseByIdService(courseId: string) {
    return apiService.get<ICourseRes>(`${API_ENDPOINTS.getcourseById}/${courseId}`)
}

function updateCourseService(data: UpdateCourseReq) {
    return apiService.post<UpdateCourseRes>(
        API_ENDPOINTS.updateCourse,
        data
    );
}

function deleteCourseService(courseId: DeleteCourseReq) {
    return apiService.delete<DeleteCourseRes>(
        `${API_ENDPOINTS.deleteCourse}/${courseId}`
    );
}

function addQuizService(data: AddQuizReq) {
    return apiService.post<AddQuizRes>(
        API_ENDPOINTS.addQuiz,
        data
    );
}

function getQuizService() {
    return apiService.get<GetQuizRes>(API_ENDPOINTS.getQuiz);
}

function getQuizByIdService(quizId: string) {
    return apiService.get<IQuizRes>(`${API_ENDPOINTS.getQuizById}/${quizId}`)
}

function updateQuizService(data: UpdateQuizReq) {
    return apiService.post<UpdateQuizRes>(
        API_ENDPOINTS.updateQuiz,
        data
    );
}

function deleteQuizService(quizId: DeleteQuizReq) {
    return apiService.delete<deleteQuizRes>(
        `${API_ENDPOINTS.deleteQuiz}/${quizId}`
    );
}

export {
    addCourseService,
    getCourseService,
    getCourseByIdService,
    updateCourseService,
    deleteCourseService,
    addQuizService,
    getQuizService,
    getQuizByIdService,
    updateQuizService,
    deleteQuizService
}