import { ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoaderAction } from 'redux-store/action/appActions';
import { AppDispatch } from 'redux-store/store';
import { getActiveSchemeService } from 'services/productService';
import previousPage from 'utils/previousPage';

function Schemes() {

  const dispatch = useDispatch<AppDispatch>();
  const [pdfPath, setPdfPath] = useState<any>(null);

  useEffect(() => {
    getCollectionList();
  }, []);

  const getCollectionList = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getActiveSchemeService();
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { data } = response.data;
        setPdfPath(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
// console.log(pdfPath)
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Marketing Material</h1>
      </header>
      {
        pdfPath && pdfPath?.file ? 
        <iframe src={pdfPath?.file} title='Scheme' className='schemes' />:
        <div className='content'>No Active Marketing Material Found For this Month</div>
      }
    </div>
  )
}

export default Schemes