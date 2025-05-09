import React, { useEffect, useMemo, useState } from 'react';
import '../style/createBeat.css';
import Footer from '../common/footer';
import { DatePicker, Form, InputNumber, Popconfirm, Select, Table, TableProps, Typography, message } from 'antd';
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersActions } from 'redux-store/action/usersAction';
import { AppDispatch } from 'redux-store/store';
import { capitalizeSubstring } from 'utils/capitalize';
import { setLoaderAction } from 'redux-store/action/appActions';
import { addTargetService, getAllTargetByEmpId, updateTargetService } from 'services/dashboardService';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import { UserRole } from 'enum/common';
import { useAuth } from 'context/AuthContext';
import { getRoleService } from 'services/usersSerivce';
import moment from 'moment';

interface Item {
    key: string;
    month: string | moment.Moment;  // Can be ISO string or moment object
    storeTarget: number;
    orderTarget: number;
    collectionTarget: number;
}
type ItemWithoutKey = Omit<Item, 'key'>;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
  
    const inputNode = dataIndex === 'month' ? (
        <DatePicker 
            picker="month" 
            format="MMMM-YYYY"
            style={{ width: '100%' }}
            disabledDate={(current) => {
                return false; // Add your date constraints here if needed
            }}
        />
    ) : (
        <InputNumber type="number" style={{ width: '100%' }} />
    );
    


    return (
        <td {...restProps}>
        {editing ? (
            <Form.Item
                name={dataIndex}
                style={{ margin: 0, width: "100%" }}
                rules={[
                    {
                        required: true,
                        message: `Field Required!`,
                    },
                    dataIndex === 'month' ? 
                        { validator: (_, value) => {
                            if (!value) return Promise.reject('Please select a month!');
                            return Promise.resolve();
                        }} : 
                        { type: 'number', message: 'Please enter only number.' }
                ]}
            >
                {inputNode}
            </Form.Item>
        ) : (
            children
        )}
    </td>

    );
};
export default function TargetVsAchivement() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const {authState} = useAuth();
    const searchParams = new URLSearchParams(location?.search);
    const userId: string | null = searchParams.get('userId');
    const [dataRole, setDataRole] = useState<any>([]);
    

    useEffect(() => {
      async function fetchData() {
          try {
              dispatch(setLoaderAction(true));
              setIsLoading(true)
              const res = await getRoleService({isActive:true});
              if (res?.data?.status === 200) {
                const d = res?.data?.data
                .filter((d: any) => (d?.key === "da693r2" || d?.key === "da693r6") && d?.isActive === true)
                .map((d: any) => {
                  // Add dynamic values based on the `key`
                  let dynamicValue;
                  
                  if (d?.key === "da693r2") {
                    dynamicValue = UserRole.SSM;
                  } else if (d?.key === "da693r6") {
                    dynamicValue = UserRole.RETAILER;
                  }
              
                  // Return the updated object with a new key-value pair
                  return {
                    ...d,                 // Spread the original object
                    roleEnum: dynamicValue   // Add the dynamic value based on the `key`
                  };
                });
                setDataRole(d);
                  dispatch(setLoaderAction(false));
                  setIsLoading(false)
              }
              setIsLoading(false)
              dispatch(setLoaderAction(false));
          } catch (error) {
              dispatch(setLoaderAction(false));
              setIsLoading(false)
          }
      }
      fetchData();
  }, []);

    const usersSSM = useSelector((state: any) => state?.users?.usersSSM);
  // Use useMemo to filter users with role 'SSM'
  const [isSelectedRole, setIsSelectedRole] = useState<any>(true);
  const [selectedRole, setSelectedRole] = useState<any>(null);

    const handleRoleChange = (selectedOption: any) => {
        setIsSelectedRole(false);
        setSelectedRole(selectedOption)
        // setSelectedExecutive(selectedOption)
    };
  const usersSSMList = useMemo(() => {
    const filteredUsers = usersSSM?.filter((data: any) => (selectedRole === UserRole.SSM ? data.role === UserRole.SSM : data.role === UserRole.RETAILER) ) || [];
    const sortedUsers = filteredUsers.sort((a: any, b: any) => {
     return a?.name?.localeCompare(b?.name)
  });

  return sortedUsers;
  }, [usersSSM, selectedRole]);

  const userFilterByRole = useMemo(() => {
    const filteredUsers = usersSSM?.filter((data: any) => data?.emp_id === Number(userId) ) || [];

  return filteredUsers;
  }, [usersSSM, selectedRole]);
//   console.log({userFilterByRole})
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        dispatch(getUsersActions());
    }, []);

    const [selectedExecutive, setSelectedExecutive] = useState<any>(Number(userId) ?? null);
    const handleExecutiveChange = (selectedOption: any) => {
        setSelectedExecutive(selectedOption);
    };
    console.log({selectedExecutive})
    
    
    const [targetAchievedData, setTargetAchievedData] = useState<any>([])
    //  console.table({targetAchievedData})
    const [data, setData] = useState<any>([]);
    const [existingData, setExistingData] = useState<boolean>(false)
    useEffect(() => {
        async function fetchTargetAchievedData() {
            try {
                dispatch(setLoaderAction(true));
                setIsLoading(true)
                const res = await getAllTargetByEmpId(selectedExecutive);
                console.log({res})
                if (res?.data?.status === 200) {
                    setTargetAchievedData(res?.data?.data)
                    dispatch(setLoaderAction(false));
                    setIsLoading(false)
                }
                setIsLoading(false)
                dispatch(setLoaderAction(false));
            } catch (error) {
                dispatch(setLoaderAction(false));
                setIsLoading(false)
            }
        }
        fetchTargetAchievedData();
    }, [selectedExecutive, existingData, userId]);


    const currDate = new Date();
    const currYear = currDate.getFullYear();
    // Determine the starting year of the financial year
    const startYear = currDate.getMonth() >= 3 ? currYear : currYear - 1;
    const startMonth = 3; // April (0-based index)
    const endMonth = 2; // March (0-based index)
    const endYear = startYear + 1;

  // Replace your targetData generation loop with this:
let targetData: any = [];
let index = 0;

// Get current date
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// Determine financial year start (April of current year)
const financialYearStart = new Date(currentYear, 3, 1); // April is month 3 (0-indexed)

// Generate months from current month to March of next year
let year = currentYear;
let month = currentMonth;

// If current month is before April, adjust the financial year
if (currentMonth < 3) {
    year = currentYear - 1;
    month = 3; // Start from April of previous year
}

// Generate 12 months of data
for (let i = 0; i < 12; i++) {
    // Reset to January if we go past December
    if (month > 11) {
        month = 0;
        year++;
    }
    
    const date = new Date(year, month, 1);
    targetData.push({
        month: date.toISOString(),
        key: index,
        storeTarget: "",
        orderTarget: "",
        collectionTarget: ""
    });
    
    month++;
    index++;
}
    const dateMYFormatting = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const monthName = dateObj.toLocaleString('default', { month: 'long' });
        return `${monthName}-${dateObj.getFullYear()}`;
    };
    
    const totalStoreTarget = data?.reduce((acc: any, item: any) => acc + Number(item.storeTarget || 0), 0);
    const totalOrderTarget = data?.reduce((acc: any, item: any) => acc + Number(item.orderTarget || 0), 0);
    const totalCollectionTarget = data?.reduce((acc: any, item: any) => acc + Number(item.collectionTarget || 0), 0);
  


    const dataSourceWithTotals = [
        ...data
    ];
    let totalText: any = {}
    if (selectedExecutive) {
        totalText = {
            key: 'total',
            month: 'Total',
            orderTarget: totalOrderTarget,
            storeTarget: totalStoreTarget,
            collectionTarget: totalCollectionTarget,
        }
        dataSourceWithTotals.push(totalText)

    }

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    
    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        const recordCopy = {...record};
        
        // Convert the month string to a moment object if it exists
        if (recordCopy.month) {
            recordCopy.month = typeof recordCopy.month === 'string' ? 
                moment(recordCopy.month) : 
                recordCopy.month;
        }
        
        form.setFieldsValue({ ...recordCopy });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as ItemWithoutKey;
        
            // Format the month if it was edited
            if (row.month) {
                // If it's a moment object (from DatePicker)
                if (moment.isMoment(row.month)) {
                    row.month = row.month.startOf('month').toISOString();
                }
                // If it's already a string, leave it as is
            }
    
            if (Object.values(row).some((value: any) => typeof value === 'number' && value < 0)) {
                message.error('Values cannot be negative');
                return;
            }
        
            let newData = [...data];
            const index = newData.findIndex((_, index) => key === index);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                setData(newData);
                setEditingKey('');
                if (targetAchievedData && targetAchievedData?.empId) {
                    try {
                        dispatch(setLoaderAction(true));
                        const response = await updateTargetService({ targetId: Number(targetAchievedData?.targetId), SSMId: Number(userId ?? selectedExecutive), target: newData });
                        dispatch(setLoaderAction(false));
                        if (response?.data?.status === 200) {
                            message.success("Updated Successfully");
                            // redirect("/target-data-table");
                        }
                    } catch (error: any) {
                        dispatch(setLoaderAction(false));
                        message.error(error?.response?.data?.message);
                    }
                }
                else {
                    try {
                        dispatch(setLoaderAction(true));
                        const response = await addTargetService({ SSMId: userId ? Number(userId) : +selectedExecutive, target: newData });
                        dispatch(setLoaderAction(false));
                        if (response?.data?.status === 200) {
                            message.success("Added Successfully");
                            setExistingData(true)
                            // redirect("/target-data-table");
                        } else {
                            message.error("Server Error");

                        }
                    } catch (error: any) {
                        dispatch(setLoaderAction(false));
                        message.error(error?.response?.data?.message);
                    }
                }
            }

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    useEffect(() => {
        if (selectedExecutive) {
            if (targetAchievedData?.targetData?.length > 0) {
                setData(targetAchievedData.targetData);
            } else {
                setData(targetData);
            }
        }
    }, [selectedExecutive, targetAchievedData, userId]);

    const columns: any = [
        {
            title: 'M-Y',
            dataIndex: 'month',
            editable:true,
            key: 'month',
            render: (date: string | Date, _: Item, index: number) => {
                const isLastRow = index === dataSourceWithTotals.length - 1;
                const dateToFormat = typeof date === 'string' ? date : date.toISOString();
                return (
                    (userId || selectedExecutive) && !isLastRow ? 
                        <a>{dateMYFormatting(dateToFormat)}</a> :
                        <a style={{fontWeight: 600, color: "rgba(0, 0, 0, 0.88)"}}>Total</a>
                );
            },
        },
       ...(selectedRole !== UserRole.RETAILER && userFilterByRole[0]?.role !==  UserRole.RETAILER ? [ {
            title: 'New Store Target',
            dataIndex: 'storeTarget',
            key: 'storeTarget',
            editable: true,
        }]:[]),
        {

            title: 'New Order Value Target',
            dataIndex: 'orderTarget',
            key: 'orderTarget',
            editable: true,

        },
        
        ...(selectedRole !== UserRole.RETAILER && userFilterByRole[0]?.role !==  UserRole.RETAILER ? [ {

            title: 'Collection Target',
            dataIndex: 'collectionTarget',
            key: 'collectionTarget',
            editable: true,
        }]:[]),
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: Item, index:any) => {
                const isLastRow = index === dataSourceWithTotals.length - 1;
                const editable = isEditing(record);
                const today = new Date()
                const monthIndex = today.getMonth()
                if (index < monthIndex - 3) {
                if(record?.collectionTarget && record?.orderTarget && record?.storeTarget){
                    return null
                   }
                }
  

                return dataSourceWithTotals?.length > 12 && (editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                ));
            },
        },
    ];
    

    const mergedColumns: any = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
    
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.dataIndex === 'month' ? 'month' : 'number', // 👈 change 'text' to 'month'
                editing: isEditing(record),
            }),
        };
    });
    
    
    const rowClassName = (record:any, index:any) => {
        if (index === dataSourceWithTotals.length - 1) {
          return 'grey-background';
        }
        return '';
      };
    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Target v/s Achievement</h1>
            </header>
            <Form autoComplete="off">
                
                <main className='content' style={{ marginBottom: "0px" }}>
                { !userId && 
                <div className='targetType targetex ' style={{paddingLeft:"32px"}}>
                        <label>Role:</label>
                      
                        <Select
                            placeholder="Select Role"
                            onChange={handleRoleChange}
                            options ={ dataRole.map((data: any) => ({
                                label: data?.name,  
                                value: data?.roleEnum  
                              }))}
                          
                        />
                    
                    </div>}
                    <div className='targetType targetex mt-10' >
                        <label>Executive:</label>
                       { Number(userId) ? <Select
                            placeholder="Select Executive"
                            onChange={handleExecutiveChange}
                            options={usersSSMList?.map((data: any) => ({
                                label: `${capitalizeSubstring(data?.name)} (${data?.role})`,
                                value: data?.emp_id,
                            }))}
                            defaultValue={Number(userId) ?? null}
                        />:
                        <Select
                            placeholder="Select Executive"
                            onChange={handleExecutiveChange}
                            options={usersSSMList?.map((data: any) => ({
                                label: `${capitalizeSubstring(data?.name)} (${data?.role})`,
                                value: data?.emp_id,
                            }))}
                          disabled={isSelectedRole}
                        //   defaultValue={selectedExecutive}

                        />
                    }
                    </div>
                    
                </main>
            </Form>
            <main className='content'>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        dataSource={
                            dataSourceWithTotals
                        }
                        bordered
                        columns={mergedColumns}
                        rowClassName={rowClassName}
                        size="small"
                        pagination={false}
                    />
                </Form>
            </main>
            <Footer />
            <style>
                {`
                .grey-background {
                    background-color: #fafafa;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.88);
                   }
                     .ant-select-selector{
                      width: 180px!important
                     }
                `}
            </style>
        </div>
    );
}
  