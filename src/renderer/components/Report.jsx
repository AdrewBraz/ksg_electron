import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faCode, faDatabase } from '@fortawesome/free-solid-svg-icons';
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
  compare: {
    path: 'compare',
    text: 'Сравнение ксг групп',
    icon: faFileExcel,
    func: () => window.api.ffomsData('compare', 'comp'),
    type: 'button'
  },
  doms: {
    path: 'doms',
    text: 'ДОМС',
    icon: faCode,
    func: () => window.api.ffomsData('ffomsChannel', 'doms'),
    type: 'nav'
  },
  rmp: {
    path: 'rmp',
    text: 'РМП',
    icon: faCode,
    func: () => window.api.ffomsData('ffomsChannel', 'rmp'),
    type: 'nav'
  },
  dbf: {
    path: 'dbf',
    text: 'Выгрузка за период Мегаклиника',
    icon: faDatabase,
    func: () => window.api.getMegaData('megaChannel'),
    type: 'button'
  },
};
const renderButton = (path, text, icon) => (
  <div key={path} className="input-group-prepend">
    <button type="submit" onClick={() => { getReport(path); }} className=" btn btn-info btn-sm">
      <p>
        {text}
        {' '}
        <span>{renderIcon(icon)}</span>
      </p>
    </button>
  </div>
);

const renderNavButton = (coll) =>  (
    <div className="input-group-prepend">
      <DropdownButton as={ButtonGroup} title='Выгрузка за период ФФОМС' id="bg-nested-dropdown">
        {Object.keys(coll).map((item, i) => {
          const { path, text, icon, type } = coll[item];
          if( type === 'nav'){
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

const Report = () => {
  let [loading, setLoading] = useState(false);
    const override = css`
      display: block;
      margin: 5rem auto;
      border-color: red;
    `;
    const getReport = async (path) => {
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
  return (
    <>
      <div>
        <div className="input-group flex-row justify-content-around w-100">
          {Object.keys(paths).map((item) => {
            const { path, text, icon, type } = paths[item];
            if(type !== 'nav'){
              return renderButton(path, text, icon)
            }
          })}
          {renderNavButton(paths)}
        </div>
      </div>
      <HashLoader size={70} margin={8} color={'#FFFFFF'} loading={loading} css={override} />
    </>
  )
};

export default Report;
