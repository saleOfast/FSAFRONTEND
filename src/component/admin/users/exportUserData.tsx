import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import * as XLSX from 'xlsx';
import { UserData } from 'types/User'; // Ensure proper typing
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { getUsersActions } from 'redux-store/action/usersAction';
import { GetUserRole, UserRole } from 'enum/common';
import { capitalizeSubstring } from 'utils/capitalize';

interface ExportUsersModalProps {
  usersData: UserData[];
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportUsersData: React.FC<ExportUsersModalProps> = ({ isModalOpen, handleExportOk,handleExportCancel, usersData }) => {
// const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
const [usersList, setUsersList] = useState<any[]>([]);
const UsersData = useSelector((state: any) => state?.users?.usersSSM);
  const dispatch = useDispatch<AppDispatch>();
 // const [usersList, setUsersList] = useState<any[]>([]);
  
  useEffect(() => {
    dispatch(getUsersActions());
  }, [])
 
  useEffect(() => {
    setUsersList(usersData);
  }, [usersData])
 
const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(usersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'UsersData.xlsx');
 //   setIsModalOpen(false);
  };

  return (
    <>
    <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
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
                        
                       
                  
                      </tr>
                    )
                  })}
    </div>
      
    </>
  );
};

export default ExportUsersData;
