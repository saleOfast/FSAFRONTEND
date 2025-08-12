import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import previousPage from "utils/previousPage";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import { getUsersActions } from "redux-store/action/usersAction";
import { Input, Table } from "antd";
import { capitalizeSubstring } from "utils/capitalize";
import DeleteItem from "../common/deleteItem";
import { deleteUserService, getRoleService } from "services/usersSerivce";
import { GetUserRole, UserRole } from "enum/common";
import { UserData, UserSSMData } from "types/User";
import { setLoaderAction } from "redux-store/action/appActions";
export default function Users() {
  const usersData = useSelector((state: any) => state?.users?.usersSSM);
  const dispatch = useDispatch<AppDispatch>();
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getUsersActions());
  }, [])

  useEffect(() => {
    setUsersList(usersData);
  }, [usersData])
 
  const searchEmployee = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = usersData.filter((item: any) =>
      (item?.name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setUsersList(FS);
  };
  const [toggleDelete, setToggleDelete] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserID] = useState('');
  const toggleHandler = (userId: string, name: string) => {
    setToggleDelete(true);
    setUserID(userId);
    setUserName(name)
  }
  const columns:any = [
    {
      title: 'Emp Id',
      dataIndex: 'emp_id',
      key: 'emp_id',
      fixed: 'left',
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (text: any, record: UserData) => {
        return <Link to={`/profile?userId=${record?.emp_id}`} className="linkt">{record?.name}</Link>;
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (text: any, record: UserData) => {
        return <span >{GetUserRole[record?.role]}</span>;
      },
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'manager',
      key: 'manager',
      width: 140,
    },
    {
      title: 'Reset Password',
      dataIndex: 'resetPassword',
      key: 'resetPassword',
      width: 100,
      render: (text: any, record: any) => {
        return <Link to={`/auth/confirm-password?empId=${record?.emp_id}&role=${UserRole.ADMIN}`}><EditOutlined /></Link>;
      },
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,
      render: (text: any, record: any) => {
        return  <Link to={`/admin/add-new-users?userId=${record?.emp_id}`} className='linkDefault' style={{color:"blue"}}><FormOutlined /></Link>
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,
      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.emp_id, record?.name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
      },
    },
  ];

  const dataSource: any = usersList?.map((item: any) => ({
    key: item?.emp_id,
    emp_id: item?.emp_id,
    name: item?.name,
    role: item?.role,
    manager: item?.manager,
    resetPassword: item?.emp_id,
    edit: <EditOutlined />,
    delete: <DeleteOutlined />
  }));
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Users</h1>
      </header>
      <Link to="/admin/add-new-users">
        <div className="addIcon">
          <PlusOutlined className="plusIcon" />
        </div>
      </Link>
      <main>
        <div className="searchproduct">
          <div className="searchStoreType">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Employee"
              onChange={searchEmployee}
              className="searchContainer"
            />
          </div>
          <DeleteItem
            toggle={toggleDelete}
            name={userName}
            itemsId={userId}
            deleteService={deleteUserService}
            closeModal={(e: any) => {
              setToggleDelete(e);
            }} />
          <main className='content'>
            <Table
              dataSource={dataSource}
              bordered
              columns={columns}
              size="small"
              pagination={false}
              scroll={{x:"100%"}}
            />
          </main>
          {/* <div>
            <table className="storeCatTable">
              <thead>
                <tr>
                  <th className="createvisittable">Emp. Id</th>
                  <th className="createvisittable">Name</th>
                  <th className="createvisittable">Role</th>
                  <th className="createvisittable">Reporting Manager</th>
                  <th className="createvisittable">Reset Password</th>

                  <th className="createvisittable"></th>
                  <th className="createvisittable"></th>
                </tr>
              </thead>
              <tbody>
                {usersList && usersList?.length > 0 &&
                  usersList?.map((data: UserData, idx: any) => {
                    const { emp_id, name, manager, role } = data;

                    console.log({data})
                    return (
                      <tr key={idx}>
                       <td className="fs-14">{emp_id}</td>
                       <td className="fs-14"><Link to={`/profile?userId=${emp_id}`} className="linkt">{capitalizeSubstring(name)}</Link></td>
                        <td className="fs-14">{GetUserRole[role]}</td>
                        <td className="fs-14">{manager}</td>
                        <td className="fs-14"><Link to={`/auth/confirm-password?empId=${emp_id}&role=${UserRole.ADMIN}`}><EditOutlined /></Link></td>
                        <td>
                  <Link to={`/admin/add-new-users?userId=${emp_id}`} className='linkDefault'>
                    <FormOutlined />
                  </Link>
                  </td>
                  <td>
                    <DeleteOutlined onClick={() => toggleHandler(emp_id, name)} className="deleteIcon"/>
                  </td>
                      </tr>
                    )
                  })}

              </tbody>
            </table>
          </div> */}
        </div>
      </main>
    </div>
  );
}
