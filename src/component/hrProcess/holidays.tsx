import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux-store/store";
import previousPage from "utils/previousPage";
import { Button, Col, message, Row, Table, Form, Select, Modal } from "antd"; // Import Modal
import { setLoaderAction } from "redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { holidaySchema } from "utils/formValidations";
import HookFormInputField from "component/HookFormInputField";
import { addHolidayService, getHolidayService } from "services/usersSerivce";
import dayjs from "dayjs";
import { TimelineEnum } from "enum/common";
import { capitalizeFirstLetter } from "utils/capitalize";

interface Option {
    value: string;
    label: string;
    children?: Option[];
}

const columns: any = [
    // { 
    //     title: 'S.N.', 
    //     dataIndex: 'holidayId', 
    //     key: 'holidayId', 
    //     width: 120 
    // },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (date: string) => dayjs(date).format("DD-MMM-YYYY")
    },
    {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
        width: 120
    },
    {
        title: 'Holiday',
        dataIndex: 'name',
        key: 'name',
        width: 120
    },
];

export default function HolidayApplication() {
    const dispatch = useDispatch<AppDispatch>();
    const [holidayData, setHolidayData] = useState<any>([]);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

    const { control, setValue, handleSubmit } = useForm({
        mode: "all",
        resolver: yupResolver(holidaySchema),
        defaultValues: { name: "", date: new Date(), day: "" },
    });

    async function fetchHolidayData(year: string) {
        try {
            dispatch(setLoaderAction(true));
            const res = await getHolidayService({ year });
            if (res?.data?.status === 200) {
                setHolidayData(res?.data?.data);
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            dispatch(setLoaderAction(false));
        }
    }

    useEffect(() => {
        fetchHolidayData(selectedYear);
    }, [selectedYear]);

    const onSubmit = async (values: any) => {
        console.log('Success:', values);

        try {
            dispatch(setLoaderAction(true));
            const res = await addHolidayService({ ...values, year: selectedYear });
            if (res?.data?.status === 200) {
                message.success(res.data.message);
                dispatch(setLoaderAction(false));
                setValue("name", "");
                setValue("date", new Date());
                setValue("day", "");
                await fetchHolidayData(selectedYear);
                setIsModalVisible(false); // Close the modal after successful submission
            } else {
                message.error("Something Went Wrong");
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
            message.error("Error adding holiday");
        }
    };

    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const yearText: string[] = [];

    for (let year = startYear; year <= currentYear; year++) {
        yearText.push(year.toString());
    }

    const options: Option[] = [
        {
            value: TimelineEnum.YEAR,
            label: 'Year',
            children: yearText?.reverse()?.map((data): Option => {
                return {
                    value: data,
                    label: capitalizeFirstLetter(data)
                };
            }),
        },
    ];

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        fetchHolidayData(value);
    };

    return (
        <div className='btmMarginMob'>
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Holidays</h1>
            </header>

            {/* Year Selection Box and Add Holiday Button in a Row */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px", marginTop: "20px", marginRight: "10px", marginLeft: "10px" }}>
                <Col>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{ width: 150 }}
                    >
                        {yearText.map(year => (
                            <Select.Option key={year} value={year}>
                                {year}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Add Holiday
                    </Button>
                </Col>
            </Row>

            {/* Modal for Adding Holiday */}
            <Modal
                title="Add Holiday"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered // Center the modal
                style={{ top: 20 }} // Adjust the top margin if needed
            >
                <Form className="add-store-form createbeat"
                    onFinish={handleSubmit(onSubmit)}
                    autoComplete="off"
                    style={{ height: "auto" }}>
                    <Row gutter={[12, 12]}>
                        {/* Holiday */}
                        <Col span={24}>
                            <Row align="middle">
                                <Col span={24}>
                                    <label>Holiday</label>
                                </Col>
                                <Col span={24}>
                                    <HookFormInputField
                                        control={control}
                                        type="text"
                                        name="name"
                                        placeholder="Holiday"
                                    />
                                </Col>
                            </Row>
                        </Col>

                        {/* Date */}
                        <Col span={24}>
                            <Row align="middle">
                                <Col span={24}>
                                    <label>Date</label>
                                </Col>
                                <Col span={24}>
                                    <HookFormInputField
                                        control={control}
                                        type="date"
                                        name="date"
                                        placeholder="Date"
                                        callback={(e: any) => {
                                            const selectedDate = e?.target?.value;
                                            setValue("date", selectedDate);
                                            if (selectedDate) {
                                                const dayName = dayjs(selectedDate).format("dddd");
                                                setValue("day", dayName);
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        {/* Day */}
                        <Col span={24}>
                            <Row align="middle">
                                <Col span={24}>
                                    <label>Day</label>
                                </Col>
                                <Col span={24}>
                                    <HookFormInputField
                                        control={control}
                                        type="text"
                                        name="day"
                                        placeholder="Day"
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <div className="orders-btn" style={{ marginTop: "10px" }}>
                        <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        <button type="submit" className="btn-save">Save</button>
                    </div>
                </Form>
            </Modal>

            <main style={{ marginTop: "10px" }}>
                <div className="searchproduct">
                    <main className='content'>
                        <Table
                            dataSource={holidayData
                                .filter((d: any) => dayjs(d.date).year().toString() === selectedYear)
                                .map((d: any) => ({
                                    name: d?.name,
                                    date: d?.date,
                                    day: d?.day
                                }))}
                            bordered
                            scroll={{ x: "100%" }}
                            columns={columns}
                            size="small"
                            pagination={false}
                        />
                    </main>
                </div>
            </main>
        </div>
    );
}