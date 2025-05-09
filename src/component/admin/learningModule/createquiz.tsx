import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addQuizSchema } from "utils/formValidations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, message, } from "antd";
import HookFormInputField from "component/HookFormInputField";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { addQuizService, getQuizByIdService, updateQuizService } from "services/learningModule/courseService";

const Createquiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  const courseId: string | null = searchParams.get('courseId');
  const quizId: string | null = searchParams.get('quizId');
  const courseName: string | null = searchParams.get('courseName');

  const [isLoading, setIsLoading] = useState(false);


  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(addQuizSchema),
    defaultValues: {
      question: "",
      marks: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: ""
    }
  })


  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (quizId) {
          setIsLoading(true);
          const res = await getQuizByIdService(quizId);
          setIsLoading(false);
          const quizData = res?.data?.data
          setValue("question", quizData?.question)
          setValue("answer", quizData?.answer)
          setValue("marks", quizData?.marks)
          setValue("option1", quizData?.option1)
          setValue("option2", quizData?.option2)
          setValue("option3", quizData?.option3)
          setValue("option4", quizData?.option4)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [quizId])



  const handleCancel = () => {
    quizId ? navigate({ pathname: `/admin/lms/course-detail?courseId=${courseId}` }) : navigate({ pathname: "/admin/dashboard/course" })
  }


  const onSubmit = async (values: any) => {
    const { question, option1, option2, option3, option4, marks, answer } = values;
    if (quizId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateQuizService({ question, option1, option2, option3, option4, marks: Number(marks), answer, quizId: Number(quizId), courseId: Number(courseId) });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Updated Successfully")
          navigate(`/admin/lms/course-detail?courseId=${courseId}`)
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));

        const response = await addQuizService({ courseId: Number(courseId), question, marks: Number(marks), answer, option1, option2, option3, option4 });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Added Successfully")
          navigate(`/admin/lms/course-detail?courseId=${courseId}`)
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{quizId ? "Update Quiz" : "Quiz"}</h1>
      </header>
      <div className="add-store-form-container">
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Course : {courseName}</div>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off">
          <HookFormInputField
            control={control}
            type="text"
            name="question"
            placeholder="Enter Question"
            label={"Question"}
            required
          />
          <HookFormInputField
            control={control}
            type="number"
            name="marks"
            placeholder="Enter Marks"
            label={"Marks"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="option1"
            placeholder="Enter Option 1"
            label={"Option 1"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="option2"
            placeholder="Enter Option 2"
            label={"Option 2"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="option3"
            placeholder="Enter Option 3"
            label={"Option 3"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="option4"
            placeholder="Enter Option 4"
            label={"Option 4"}
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="answer"
            placeholder="Enter correct Answer"
            label={"Correct Answer"}
            required
          />
          <div className="button-container">
            <Button onClick={handleCancel}>
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

export default Createquiz;