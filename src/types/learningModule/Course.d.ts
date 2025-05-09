import { usersActionsType } from "redux-store/action-type/usersActionsType";

export type AddCourseReq = {
    courseName: string;
     description: string;
     isActive: boolean;
     dueDate: string;
     thumbnailUrl: string;
     videoLink: string;
     targetAudience: number;
     quizDuration: number;
     launchedDate: Date

}

export type AddCourseRes = IApiResponse<{
    message: string;
}>

export type AddQuizReq = {
  courseId: number;
  question: string;
  marks: number;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}
export type AddQuizRes = IApiResponse<{
  message: string;
}>

export type ICourseData = {
    courseId: number
    courseName: string
    description: string
    isActive: boolean
    dueDate: string
    videoLink: string
    targetAudience: string[]
    quizDuration: number
    launchedDate: string
}
export type UpdateCourseReq = {
    courseId: number
    courseName: string
    description: string
    isActive: boolean
    dueDate: string
    thumbnailUrl: string
    videoLink: string
    targetAudience: string[]
    quizDuration: number
    launchedDate: string
}

export type UpdateCourseRes = IApiResponse<{
  message: string;
}>
export type IQuizData = {
  courseId: number;
  question: string;
  marks: number;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}
export interface ICourseReducer {
    // course : ICourseData[];
    // quiz: IQuizData[];
  }

export type GetCourseRes = IApiResponse<ICourseData[]>
export type GetQuizRes = IApiResponse<IQuizData[]>

export type ICourseRes = IApiResponse<ICourseData>;
export type IQuizRes = IApiResponse<IQuizData>;
  export interface ISetCourseAction {
    type: learningActionsType.GET_COURSE;
    payload: ICourseData[];
  }

  export interface ISetQuizAction {
    type: learningActionsType.GET_QUIZ;
    payload: IQuizData[];
  }
  
export type ICourseReducerAction =  ISetCourseAction | ISetQuizAction;

export type UpdateQuizReq = {
  quizId: number;
  courseId: number;
  question: string;
  marks: number;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export type DeleteCourseReq = {
  courseId: number;
}

export type DeleteCourseRes = IApiResponse<{
  message: string;
}>

export type UpdateQuizRes = IApiResponse<{
  message: string;
}>


export type DeleteQuizReq = {
  quizId: number;
}

export type deleteQuizRes = IApiResponse<{
  message: string;
}>
