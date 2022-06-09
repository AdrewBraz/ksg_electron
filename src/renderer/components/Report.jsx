import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faCode, faDatabase, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';

const renderIcon = (icon) => <FontAwesomeIcon className="icon" icon={icon} />;

const paths = {
  excel: {
    path: 'excel',
    text: 'Отчет за период ФФОМС',
    icon: faFileExcel,
    func: () => window.api.ffomsData('ffomsChannel', 'excel'),
    type: 'button'
  },
  pdfServ: {
    path: 'pdfServ',
    text: '1974',
    icon: faFilePdf,
    func: () => window.api.pdfCreation('pdf', 'serv'),
    type: 'PDF nav'
  },
  pdfHosp: {
    path: 'pdfHosp',
    text: 'Эпикризы',
    icon: faFilePdf,
    func: () => window.api.pdfCreation('pdf', 'hosp'),
    type: 'PDF nav'
  },
  doms: {
    path: 'doms',
    text: 'ДОМС',
    icon: faCode,
    func: () => window.api.ffomsData('ffomsChannel', 'doms'),
    type: 'XML nav'
  },
  rmp: {
    path: 'rmp',
    text: 'РМП',
    icon: faCode,
    func: () => window.api.ffomsData('ffomsChannel', 'rmp'),
    type: 'XML nav'
  },
  dbf: {
    path: 'dbf',
    text: 'Выгрузка за период Мегаклиника',
    icon: faDatabase,
    func: () => window.api.getMegaData('megaChannel'),
    type: 'button'
  },
};

const Report = () => {
  console.log(window.api)
  let [loading, setLoading] = useState(false);
    const override = css`
      display: block;
      margin: 5rem auto;
      border-color: red;
    `;
    const getReport = async (path) => {
      console.log(path)
      const { func } = paths[path]
      try {
        setLoading(true)
        await func().then(() => {
          setLoading(false)
          return 'success';
        }).then(() => console.log('success'));
      } catch (e) {
        throw new Error('Something went wrong');
      }
    };
    const renderButton = (path, text, icon) => (
      <div key={path} className="input-group-prepend m-3">
        <button type="submit" onClick={() => { getReport(path); }} className=" btn btn-info btn-sm">
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
        <div className="input-group flex-row justify-content-around w-100">
          {Object.keys(paths).map((item) => {
            const { path, text, icon, type } = paths[item];
            if(type === 'button'){
              return renderButton(path, text, icon)
            }
          })}
          {renderNavButton(paths, 'XML nav', 'Выгрузка в ФФОМС за период')}
          {renderNavButton(paths, 'PDF nav', 'Выгрузка выписных эпикризов')}
        </div>
      </div>
      <HashLoader size={70} margin={8} color={'#FFFFFF'} loading={loading} css={override} />
    </>
  )
};

export default Report;
