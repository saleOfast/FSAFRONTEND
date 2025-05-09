import React, { useState } from 'react'
import { IVisitsData } from 'types/Visits';
import { dateFormatterNew } from 'utils/common';
import VisitCheckIn from './visitChenkIn';
import { IGeoCoordinate } from 'types/Common';
import { VisitStatus } from 'enum/visits';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from 'utils/capitalize';
import { UserRole } from 'enum/common';
import { useAuth } from 'context/AuthContext';

interface IVisitsItem {
    data: IVisitsData;
    coordinates: IGeoCoordinate | null;
}
function VisitsItem({ data, coordinates }: IVisitsItem) {
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate();
    const {authState} = useAuth()
    return (
        <>
            <VisitCheckIn
                toggle={toggle}
                setToggle={setToggle}
                data={data}
                coordinates={coordinates}
            />
            {data.storeDetails && <>
              {/* <Link to="javascript:void(0)" className='linkto' style={{cursor:"auto"}}> */}
              {/* <div 
            //   style={{cursor: data.visitStatus === VisitStatus.COMPLETE || data?.checkIn ? "pointer" : "auto"}}
            style={{cursor:"pointer"}}
              > */}
                <div className="visit-list visit-listing"  style={{cursor:"pointer"}} key={data.visitId} onClick={() => {
                    // if (data.visitStatus === VisitStatus.COMPLETE || data?.checkIn) {
                        navigate({ pathname: `/visit-details/${data.storeDetails.storeId}/${data.visitId}` })
                    // }
                }}>
                    <div className='visitStoName'>
                        {data.storeDetails.storeName}
                    </div>
                    {data.storeDetails.storeId && data.storeDetails?.storeCat?.categoryName
                        &&
                        <span className="visitfontcolor">{data.storeDetails?.storeCat?.categoryName} | store ID: {data.storeDetails.storeId}</span>
                    }
                    <div
                        className="flexSpace visitfontcolor"
                    >
                        <span>Beat: {data.beatDetails.beatId}, {data.beatDetails.beatName}</span>
                        {data.visitDate && <span>
                            Visit Date:{" "}
                            <span className='visitDateTxt'>
                                {dateFormatterNew(data.visitDate)}
                            </span>
                        </span>}
                    </div>
                    <div className="flexSpace visitfontcolor mtrb-12">
                        <span>
                            Status:{" "}
                            <span className="visitStaTxt" 
                            style={{color: VisitStatus.PENDING === data?.visitStatus ? "#E61B23" : "green"}}>
                                {capitalizeFirstLetter(data.visitStatus.toLowerCase())}
                            </span>
                        </span>
                       {/* {!data?.checkIn ? <>  {
                            data.visitStatus !== VisitStatus.COMPLETE && UserRole.ADMIN !== authState?.user?.role && 
                            <Button
                                size='small'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setToggle(!toggle);
                                }}
                                className='visitCheckTxt'>
                                Check-In
                            </Button>
                        }</>: 
                        <span>Check In: <span className="visitDateTxt"> {dateFormatterNew(data?.checkIn)}</span></span>} */}
                    </div>
                    {data?.noOrderReason &&
                    <div className="flexSpace visitfontcolor mtrb-10">
                        <span>
                            {/* Status:{" "} */}
                            <span className="visitStaTxt" 
                            style={{color: "#E61B23" }}>
                              No Order Reason: {" "}
                            </span>
                            <span>{data?.noOrderReason}</span>
                        </span>
                      
                    </div>}
                    
                </div>
                <style>
                    {`
                    .visit-listing {
    
   
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    font-size: 14px;
    padding: 14px 10px 14px;
    border-radius: 8px;
                    `}
                </style>
                {/* </div> */}
                {/* </Link> */}
            </>}

        </>
    )
}

export default VisitsItem