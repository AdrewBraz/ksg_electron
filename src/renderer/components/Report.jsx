import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFileExport, faDatabase, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { css } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';

const renderIcon = (icon) => <FontAwesomeIcon className="icon" icon={icon} />;

const paths = {
  excel: {
    path: 'excel',
    text: 'Отчет за период ФФОМС',
    icon: faFileExcel,
    func: () => window.api.ffomsData('ffomsChannel', 'excel'),
    type: 'button',
    isDisabled: false
  },
  pdfServ: {
    path: 'pdfServ',
    text: 'Отчёт в Минздрав',
    icon: faFilePdf,
    func: () => window.api.pdfCreation('pdf', 'serv'),
    type: 'PDF nav',
    isDisabled: false
  },
  rmp: {
    path: 'rmp',
    text: 'Выгрузка счета в ГИС ОМС',
    icon: faFileExport,
    func: () => window.api.ffomsData('ffomsChannel', 'rmp'),
    type: 'button',
    isDisabled: false
  },
  dbf: {
    path: 'dbf',
    text: 'Выгрузка за период Мегаклиника',
    icon: faDatabase,
    func: () => window.api.getMegaData('megaChannel'),
    type: 'button',
    isDisabled: false
  },
};

const Report = () => {
  console.log(window.api)
  let [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState('');
    const override = css`
      display: block;
      margin: 10rem auto;
      border-color: red;
    `;
    const getReport = async (path) => {
      console.log(path)
      const { func } = paths[path]
      try {
        setLoading(true)
        setReportError('');
        await func();
      } catch (e) {
        setReportError(e.message);
      } finally {
        setLoading(false);
      }
    };
    const renderButton = (path, text, icon, isDisabled) => (
      <div key={path} className="input-group-prepend m-3">
        <button type="submit" onClick={() => { getReport(path); }} className="btn btn-primary" disabled={isDisabled}>
          <p>
            {text}
            {' '}
            <span>{renderIcon(icon)}</span>
          </p>
        </button>
      </div>
    );
    const renderNavButton = (coll, dropType, title) =>  (
      <div className="input-group-prepend m-3">
        <DropdownButton variant="info" as={ButtonGroup} title={title} id="bg-nested-dropdown">
          {Object.keys(coll).map((item, i) => {
            const { path, text, icon, type } = coll[item];
            if( type === dropType){
              return (
                <Dropdown.Item key={path+type} eventKey={i} onClick={() => { getReport(path)}}>
                  {text}
                </Dropdown.Item>
              )
            }
          })}
        </DropdownButton>
      </div>
    )
  
  return (
    <>
      <div>
        {reportError && <p role="alert">{reportError}</p>}
        <div className="input-group flex-row justify-content-around w-100 mt-3">
          {Object.keys(paths).map((item) => {
            const { path, text, icon, type, isDisabled} = paths[item];
            if(type === 'button'){
              return renderButton(path, text, icon, isDisabled)
            }
          })}
        </div>
        <div className='d-flex justify-content-center align-items-center mt-3'>
          <GridLoader size={40} margin={8} color={'#1d3ef5ff'} loading={loading} css={override} />
        </div>
      </div>
    </>
  )
};

export default Report;
