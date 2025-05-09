import React, { useCallback, useState } from "react";
import "../../../style/addScheme.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AppDispatch } from "redux-store/store";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { Button, DatePicker, Form, message, Typography } from "antd";
import HookFormInputField from "component/HookFormInputField";
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import { getOrderSignedUrlService } from "services/orderService";
import { uploadFileToS3 } from "utils/uploadS3";
import { createProductSchemeService } from "services/productService";
import { useLocation, useNavigate } from "react-router-dom";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";

const initialFormData: any = {
  name: "",
  month: "",
  year: "",
  file: ""
};

const createSchema = Yup.object({
  "name": Yup.string().required('Fields required'),
  "month": Yup.string().required('Fields required'),
  "year": Yup.string().required('Fields required'),
  "file": Yup.string().required('Fields required')
})

export default function AddNewScheme() {

  const { Text } = Typography;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const schemeId: string | null = searchParams.get('schemeId');
  const [isLoading, setIsLoading] = useState(false);
  const [dateErrorMsg, setDateErrorMsg] = useState<any>('');

  const {
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm({
    mode: "all",
    resolver: yupResolver(createSchema),
    defaultValues: initialFormData
  });

  const onSubmit = async (value: any) => {
    try {
      dispatch(setLoaderAction(true))
      const res = await getOrderSignedUrlService(watch()?.file?.name);
      await uploadFileToS3(res.data.data, watch()?.file);
      const reqBody = {
        ...value,
        file: res.data.data.fileUrl,
        month: +value.month,
        year: +value.year,
      }
      const response = await createProductSchemeService(reqBody);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        message.success("Scheme added successfully");
        navigate('/admin/scheme');
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }

  const handleDate = useCallback(async (date: any, dateString: string) => {
    if (dateString) {
      const my = dateString.split('-');
      setValue('year', my[0]);
      setValue('month', my[1]);
      setDateErrorMsg('');
    }
  }, [setValue]);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    setValue('file', selectedFile);
  };

  function cancel() {
    navigate('/admin/scheme');
  }

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{schemeId ? "Update Marketing Material":"Upload Marketing Material PDF"}</h1>
      </header>
      <main>
        <div className="add-scheme">
          <Form
            onFinish={handleSubmit(onSubmit, err => {
              if (err && err.month && err.month.message) {
                setDateErrorMsg(err.month.message);
              }
            }
            )}
            autoComplete="off">
            <div className="mb-2">
              <HookFormInputField
                control={control}
                type="text"
                name="name"
                placeholder="Enter name"
                label={"Name"}
                required
              />
            </div>
            <label>Month &amp; Year<Text type="danger">*</Text></label>
            <DatePicker
              name="month"
              placeholder="Select month &amp; year"
              picker="month"
              style={{ borderColor: dateErrorMsg ? '#ff4d4f' : '#d9d9d9' }}
              onChange={handleDate}
              disabledDate={disabledDate}
            />
            {
              dateErrorMsg && <Text type="danger">{dateErrorMsg}</Text>
            }
            <div className="mt-8">
              <label>Upload File<Text type="danger">*</Text></label>
              <input
                type="file"
                name="file"
                placeholder=""
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="schemeBtn">
              <Button onClick={cancel} className="btnC">Cancel</Button>
              <Button className="btnS" htmlType="submit">Save</Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
