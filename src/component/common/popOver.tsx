import React from "react";
interface IPopover {
  showModal: boolean;
  setshowModal: any;
  attendanceToggle: any;
  children: React.ReactNode;
}

export default function PopOver(props: IPopover) {
  const handleCapturing = () => {
    props.setshowModal(!props.showModal);
  };
  const handleContainer = (e: any) => {
    e.stopPropagation();
  };
  const attendanceToggle = props?.attendanceToggle;
  return (
    <div
      id="modal"
      className="container popoverContent"
      onClick={() => {
        handleCapturing();
        attendanceToggle(!props.showModal);
      }}>
      <div
        className="modalContent popchildContent"
        onClick={handleContainer}
      >
        {props.children}
      </div>
    </div>
  );
}
