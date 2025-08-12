import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { addCourseSchema } from "utils/formValidations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, message, } from "antd";
import HookFormInputField from "component/HookFormInputField";
import HookFormSelectField from "component/HookFormSelectField";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { useSelector } from "redux-store/reducer";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { addCourseService, getCourseByIdService, updateCourseService } from "services/learningModule/courseService";
import { getOrderSignedUrlService } from "services/orderService";
import { uploadFileToS3 } from "utils/uploadS3";
import { getUsersLearningRoleActions } from "redux-store/action/usersAction";
import { AppDispatch } from "redux-store/store";


const AddCourse = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const multipleTargetAudience: any = useSelector((state: any) => state?.users?.usersLearningRole?.map((i: any) => ({
    label: i.learningRole,
    value: i.learningRole
  })));
  const [managersList, setManagersList] = useState<any[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const courseId: string | null = searchParams.get('courseId');
  useEffect(() => {
    setManagersList(managersList);
  }, [managersList])

  useEffect(() => {
    dispatch(getUsersLearningRoleActions());
  }, []);
  const {
    control,
    handleSubmit,
    setValue
  } = useForm({
    mode: "all",
    resolver: yupResolver(addCourseSchema),
    defaultValues: {
      courseName: "",
      description: "",
      isActive: "true",
      dueDate: "",
      targetAudience: [],
      quizDuration: "",
      launchedDate: ""
    }
  })

  const learningActive: any = [
    {
      label: "True",
      value: "true"
    },
    {
      label: "False",
      value: "false"
    },
  ]



  const handleCancel = () => {
    navigate({ pathname: "/admin/dashboard/course" })
  }

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function getCourseData() {
      try {
        if (courseId) {
          setIsLoading(true);
          const res = await getCourseByIdService(courseId);
          setIsLoading(false);
          const courseData = res?.data?.data?.course
          setData(courseData?.videoLink)
          setValue("courseName", courseData?.courseName)
          setValue("description", courseData?.description)
          setValue("isActive", String(courseData?.isActive))
          setValue("dueDate", courseData?.dueDate)
          setValue("targetAudience", courseData?.targetAudience)
          setValue("quizDuration", courseData?.quizDuration)
          setValue("launchedDate", courseData?.launchedDate)

        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getCourseData();
  }, [courseId])

  const onSubmit = async (values: any) => {
    const { courseName, description, isActive = true, dueDate, targetAudience, quizDuration, launchedDate } = values;
    let videoRes: any;
    if (video) {
      videoRes = await getOrderSignedUrlService(video?.name);
      await uploadFileToS3(videoRes.data.data, video);
    }
    let thumbnailRes: any;
    if (thumbnail) {
      thumbnailRes = await getOrderSignedUrlService(thumbnail?.name);
      await uploadFileToS3(thumbnailRes.data.data, thumbnail);
    }
    if (courseId) {
      try {
        dispatch(setLoaderAction(true));


        const response = await updateCourseService({ courseName, description, isActive: Boolean(isActive), dueDate, thumbnailUrl: thumbnail ? thumbnailRes.data.data.fileUrl : "", videoLink: video ? videoRes.data.data.fileUrl : "", targetAudience, quizDuration: Number(quizDuration), launchedDate, courseId: Number(courseId) });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Updated Successfully")
          navigate(`/admin/dashboard/course`)
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));
        // const res = await getOrderSignedUrlService(video?.name);
        // await uploadFileToS3(res.data.data, video);
        const response = await addCourseService({ courseName, description, isActive: Boolean(isActive), dueDate, thumbnailUrl: thumbnail ? thumbnailRes.data.data.fileUrl : "", videoLink: video ? videoRes.data.data.fileUrl : "", targetAudience, quizDuration: Number(quizDuration), launchedDate });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Added Successfully")
          navigate("/admin/dashboard/course")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };
  const fileInputRef = useRef<any>(null);

  const [video, setVideo] = useState<any>("")
  const [thumbnail, setThumbnail] = useState<any>("")
  const handleFileChange = async (event: any) => {
    setVideo(event.target.files[0])
  }
  const handleThumbnailFileChange = async (event: any) => {
    setThumbnail(event.target.files[0])
  }
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{courseId ? "Update Course" : "Add Course"}</h1>
      </header>
      <div className="add-store-form-container">
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off">
          <HookFormInputField
            control={control}
            type="text"
            name="courseName"
            placeholder="Enter Course Name"
            label={"Course Name"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="description"
            placeholder="Enter Description"
            label={"Description"}
            required
          />
          <HookFormSelectField
            control={control}
            type="boolean"
            name="isActive"
            placeholder="Select"
            label={"Active"}
            optionData={learningActive}
            required
          />
          <HookFormInputField
            control={control}
            type="date"
            name="dueDate"
            placeholder="Due Date"
            label={"Due Date"}
            required
          />
          <HookFormInputField
            control={control}
            type="date"
            name="launchedDate"
            placeholder="Launch Date"
            label={"Launch Date"}
            required
          />
          <label>Thumbnail: </label>
          <input
            type="file"
            ref={fileInputRef}
            className="profileRef"
            onChange={handleThumbnailFileChange}
          />

          <label>Video: </label>
          <input
            type="file"
            ref={fileInputRef}
            className="profileRef"
            onChange={handleFileChange}
          />

          <HookFormSelectField
            control={control}
            type="text"
            name="targetAudience"
            placeholder="Select Target Audience"
            label={"Target Audience"}
            showSearch
            mode="multiple"
            allowClear
            defaultValue={[]}
            optionData={multipleTargetAudience}
            required
          />
          <HookFormInputField
            control={control}
            type="number"
            name="quizDuration"
            placeholder="Quiz Time Duration"
            label={"Quiz Time Duration"}
            required
          />
          <div className="button-container">
            <Button onClick={handleCancel} htmlType="button">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>

  );
};

export default AddCourse;
