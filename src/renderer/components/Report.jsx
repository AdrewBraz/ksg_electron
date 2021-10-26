import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faCode, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const renderIcon = (icon) => <FontAwesomeIcon className="icon" icon={icon} />;

const paths = {
  excel: {
    path: 'excel',
    text: 'Отчет за период ФФОМС',
    icon: faFileExcel,
    func: () => window.api.ffomsData('ffomsChannel', 'excel'),
  },
  // compare: {
  //   path: 'compare',
  //   text: 'Сравнение ксг групп',
  //   icon: faFileExcel,
  //   func: () => window.api.ffomsData('compare', 'comp'),
  // },
  // xml: {
  //   path: 'xml',
  //   text: 'Выгрузка за период ФФОМС',
  //   icon: faCode,
  //   func: () => window.api.ffomsData('ffomsChannel', 'xml'),
  // },
  dbf: {
    path: 'dbf',
    text: 'Выгрузка за период Мегаклиника',
    icon: faDatabase,
    func: () => window.api.getMegaData('megaChannel')
  },
};

const Report = () => {
  let [loading, setLoading] = useState(false);
    const override = css`
      display: block;
      margin: 5rem auto;
      border-color: red;
    `;
    const getReport = async (path) => {
      const { func } = paths[path]
      console.log(func)
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
  return (
    <>
      <div>
        <div className="input-group flex-row justify-content-around w-100">
          {Object.keys(paths).map((item) => {
            const { path, text, icon } = paths[item];
            console.log(text);
            return renderButton(path, text, icon);
          })}
        </div>
      </div>
      <HashLoader size={70} margin={8} color={'#FFFFFF'} loading={loading} css={override} />
    </>
  );
};

export default Report;
