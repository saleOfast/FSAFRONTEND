/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { Link, useLocation } from "react-router-dom";
import { deleteQuizService, getCourseByIdService } from "services/learningModule/courseService";
import { dateFormatterNew } from "utils/common";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { getQuizActions } from "redux-store/action/learningModule/learningActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import DeleteItem from "../common/deleteItem";

const CourseDetail = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(location?.search);

  const courseId: string | null = searchParams.get('courseId');
  const quizData = useSelector((state: any) => state?.learning?.quiz);
  const [courseData, setCourseData] = useState<any>();
  const [quizList, setQuizList] = useState<any>();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getQuizActions());
  }, []);
  useEffect(() => {
    setQuizList(quizData);
  }, [quizData]);
  useEffect(() => {
    async function getCourseData() {
      try {
        if (courseId) {
          setIsLoading(true);
          const res = await getCourseByIdService(courseId);
          setIsLoading(false);
          setCourseData(res?.data?.data)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getCourseData();
  }, [courseId])

  const [toggleDelete, setToggleDelete] = useState(false);
  const [questionName, setQuestionName] = useState('');
  const [quizId, setQuizID] = useState('');

  const toggleHandler = (quizId: string, name: string) => {
    setToggleDelete(true);
    setQuizID(quizId);
    setQuestionName(name)
  }

  return (

    <div>
      <FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Course Details</h1>
      </header>
      <DeleteItem
        toggle={toggleDelete}
        name={questionName}
        itemsId={quizId}
        deleteService={deleteQuizService}
        closeModal={(e: any) => {
          setToggleDelete(e);
        }} />
      <div className="content">
        {<>
          <table className="courseTable">
            <thead>
              <tr>
                <th className="createvisittable txtC" style={{ fontSize: "15px" }}>Field</th>
                <th className="createvisittable txtC" style={{ fontSize: "15px" }} >Value</th>
              </tr>
            </thead>
            <tbody className="fs-15">
              <tr>
                <td className="courseField fw-bold">Course Name</td>
                <td>{courseData?.course?.courseName}</td>
              </tr>
              <tr>
                <td className="courseField fw-bold">Description</td>
                <td>{courseData?.course?.description}</td>
              </tr>
              <tr>
                <td className="courseField fw-bold">Due Date</td>
                <td>{dateFormatterNew(courseData?.course?.dueDate)}</td>
              </tr>
              <tr>
                <td className="courseField fw-bold">Active</td>
                <td>{courseData?.course?.isActive ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className="courseField fw-bold">Target Audience</td>
                <td>{courseData?.course?.targetAudience.join(", ")}</td>
              </tr>
              <tr>
                <td className="courseField fw-bold">Quiz Time Duration</td>
                <td>{courseData?.course?.quizDuration} minute</td>
              </tr>
            </tbody>
          </table>
          <div className="course-det">
            <div>
              <span className="fw-bold mt-8">Video:</span><span></span>
            </div>
            {/* <video width="100%" height="auto" controls>
              <source src={courseData?.course?.videoLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
            <div style={{width: "60%"}}>
              <iframe
                style={{borderRadius:"20px"}}
                width="100%"
                height="400px"
                src="https://www.youtube.com/embed/f78ABEVoACA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="course-det mt-30">
            <div>
              <span className="fw-bold mt-8">Learning Session:</span><span></span>
            </div>
            <table className="courseTable">
              <thead>
                <tr>
                  <th className="createvisittable txtC" style={{ fontSize: "15px" }}>Id</th>
                  <th className="createvisittable txtC" style={{ fontSize: "15px" }} >Name</th>
                  <th className="createvisittable txtC" style={{ fontSize: "15px" }} >Learning Role</th>
                </tr>
              </thead>
              <tbody className="fs-15">
                {courseData?.learningSessionUserList && courseData?.learningSessionUserList?.length > 0 && courseData?.learningSessionUserList?.map((data: any) => {
                  return (
                    <tr>
                      <td className="txtC">{data?.learningSessionId}</td>
                      <td className="txtC">{data?.user?.firstname}</td>
                      <td className="txtC">{data?.user?.learningRole}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </div>
          <div style={{ marginBottom: "30px" }}>
            <span className="fw-bold mt-8">Quiz: {courseData?.quizList?.length == 0 && <span style={{ color: "red", fontSize: "16px" }}>No Question Found</span>}</span>
            {
              (courseData?.quizList && courseData?.quizList?.length > 0) && courseData?.quizList?.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    {/* <Link
                  // to={``}
                  to={`/admin/lms/course-detail?courseId=${item?.courseId}`}
                  className="linktoB"> */}
                    <div className="quiz-list">
                      {/* <div className="dflex">
                      <img src="https://www.savannahtech.edu/wp-content/uploads/2021/02/Creating-Web-Pages-Thumbnail-1-1024x576.png" alt=""
                      width="140px" style={{borderRadius: "12px"}} height="100px"/>
                    </div> */}
                      <div className="storeConlis">
                        <div>
                          <div className="quiz-ques">
                            <div className="dflex-sb">
                              <span style={{ fontSize: "16px", fontWeight: "bold" }}>Question {index + 1}</span>
                              <div className="dflex-sa" style={{ paddingRight: "16px" }}>
                                <Link to={`/admin/lms/create-quiz?courseId=${courseId}&quizId=${item?.quizId}&courseName=${courseData?.course?.courseName}`} className="linkto">
                                  <span><FormOutlined style={{ paddingRight: "20px" }} /></span></Link>
                                <span><DeleteOutlined onClick={() => toggleHandler(item?.quizId, `Question ${index + 1}`)} className="deleteIcon" /></span>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flexSpace storeAddTxt" >
                            <span style={{ fontSize: "15px" }}>{item?.question}</span>
                          </div>

                          <div
                            className="flexSpace storeAddTxt">
                            <span><span className="fontb">Option 1: </span>{item?.option1}</span>
                          </div>
                          <div
                            className="flexSpace storeAddTxt">
                            <span><span className="fontb">Option 2: </span>{item?.option2}</span>
                          </div>
                          <div
                            className="flexSpace storeAddTxt">
                            <span><span className="fontb">Option 3: </span>{item?.option3}</span>
                          </div>
                          <div
                            className="flexSpace storeAddTxt">
                            <span><span className="fontb">Option 4: </span>{item?.option4}</span>
                          </div>
                          <div
                            className="flexSpace storeAddTxt mt-8">
                            <span><span className="fontb" style={{ color: "green" }}>Answer: </span>{item?.answer}</span>
                          </div>
                          <div
                            className="flexSpace storeAddTxt">
                            <span><span className="fontb">Marks: </span>{item?.marks}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
          </div>
        </>
        }

      </div>
    </div>
  );
};

export default CourseDetail;

