import { Button, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoaderAction } from '../../redux-store/action/appActions';
import { getOrderSignedUrlService } from 'services/orderService';
import { dataURLtoFile, uploadFileToS3 } from 'utils/uploadS3';
import { updateVisitPictureService } from 'services/visitsService';
import { IVisitParams } from 'types/Visits';
import { useParams } from 'react-router-dom';

interface IVisitsTakPicture {
  show: boolean;
  setShow: any;
  setFileUrl: any;
  getVisitDetails: any;
}
function VisitsTakPicture({ setShow, show, setFileUrl, getVisitDetails }: IVisitsTakPicture) {
  const dispatch = useDispatch();
  const params = useParams<IVisitParams>()
  const videoRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState<null | string>(null);

  const startCamera = async () => {
    try {
      dispatch(setLoaderAction(true))
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      dispatch(setLoaderAction(false))
      videoRef.current.srcObject = stream;
    } catch (error) {
      dispatch(setLoaderAction(false))
      console.error('Error accessing the camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream?.getTracks();
      tracks.forEach((track:any) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (show) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [show])

  const handleCaptureImage = () => {
    const canvas = document.createElement('canvas');
    if (canvas) {
      canvas.width = window.innerWidth - 80;
      canvas.height = 232;
      canvas?.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL('image/jpg');
      setCapturedImage(image);
    }
  };

  const handleCancel = () => {
    stopCamera()
    setTimeout(() => setShow(false), 0);
  }

  const handleSubmit = async () => {
    try {
      stopCamera()
      if (capturedImage) {
        dispatch(setLoaderAction(true))
        const fileName = `${Date.now()}.jpg`;
        const res = await getOrderSignedUrlService(fileName);
        await uploadFileToS3(res.data.data, dataURLtoFile(capturedImage, fileName))
        setFileUrl(res.data.data.fileUrl);
        dispatch(setLoaderAction(false))
        if (params.visitId) {
          await updateVisitPictureService({ image: res.data.data.fileUrl, visitId: +params.visitId })
          getVisitDetails()
        }
      }
      setTimeout(() => setShow(false), 0);
    } catch (error) {
      dispatch(setLoaderAction(false))
    }
  }
  
  return (
    <Modal
      open={show}
      title="Take Picture"
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Submit"
      okButtonProps={{
        disabled: capturedImage === null
      }}
      centered>
      <div className="visit-picture">
        <div className="visit-video-cont">
          <video ref={videoRef} autoPlay width={"100%"} />
        </div>
        <Button type='primary' onClick={handleCaptureImage}>Capture Image</Button>
        <div>
          {capturedImage && <img src={capturedImage} alt="Captured" />}
        </div>
      </div>
    </Modal>
  );
};

export default VisitsTakPicture
