/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { Link, useLocation } from "react-router-dom";
import { dateFormatterNew } from "utils/common";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import { getCourseActions } from "redux-store/action/learningModule/learningActions";

const MylearningAssessment = () => {
  // const navigate = useNavigate();
  // const { handleSubmit } = useForm();
  const location = useLocation();
  // const quizScore = location.state?.quizScore || 0;
  // const onSubmit = () => {
  //   // Handle form submission logic here
  // };
  const dispatch = useDispatch<AppDispatch>();

  // const courseDetails:any = []
  // let courseData:any =[]
  const courseData = useSelector((state: any) => state?.learning?.course);
  const [courseDetails, setCourseDetails] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getCourseActions());
  }, []);

  useEffect(() => {
    setCourseDetails(courseData);
  }, [courseData]);
  const searchCourse = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = courseData.filter((item: any) =>
      (item?.courseName?.toLowerCase())?.includes(value.toLowerCase())
    );
    setCourseDetails(FS);
  };

  return (
    <div className="store-v1">
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">My Assessment</h1>
      </header>
      <main>
        <div className="search">
          <Input prefix={<SearchOutlined />} placeholder="Search Course" onChange={searchCourse} />
        </div>

        {
          (courseDetails && courseDetails?.length > 0) && courseDetails?.map((item, index) => {
            return (
              <div key={index}>
                <div className="course-list">
                  <Link
                    to={`/admin/lms/course-detail?courseId=${item?.courseId}`}
                    className="linktoB">
                    <div className="dflex">
                      {item?.thumbnailUrl ?
                        <img src={item?.thumbnailUrl} alt=""
                          width="140px" style={{ borderRadius: "12px" }} height="100px" />
                        :
                        <img src="https://www.ultimatesource.toys/wp-content/uploads/2013/11/dummy-image-landscape-1-1024x800.jpg" alt=""
                          width="140px" style={{ borderRadius: "12px" }} height="100px" />
                      }
                    </div>
                  </Link>
                  <div className="storeConlis ">
                    <Link
                      to={`/admin/lms/course-detail?courseId=${item?.courseId}`}
                      className="linktoB">
                      <div>
                        <div className="shoptitle">
                          <div className="storeIdTxt">
                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{item?.courseName}</span>
                          </div>
                        </div>
                        <div
                          className="flexSpace storeAddTxt">
                          <span><span className="fontb">Launch: </span>{dateFormatterNew(item?.launchedDate)}</span>
                        </div>
                        <div
                          className="flexSpace storeAddTxt">
                          <span><span className="fontb">Due Date: </span>{dateFormatterNew(item?.dueDate)}</span>
                        </div>
                      </div>
                    </Link>
                    {/* <div className={item?.isActive ? "activetag" : "inActivetag"} style={{ background: "#f0f2f7", width: "60px", marginTop: "4px" }}>
                        <span
                          className={item?.isActive ? "blinker" : "blinker-inActive"}
                        >
                        </span>
                        <span>{item?.isActive ? "Active" : "Inactive"}</span>
                      </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        {/* {
          totalStoreRecords > 0 && courseDetails.length < totalStoreRecords &&
          <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
        } */}
      </main>
    </div>
  );
};

export default MylearningAssessment;