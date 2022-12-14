import { LoaderDots } from '@thumbtack/thumbprint-react';
import { convertObjectToParam } from '@utils';
import { throws } from 'assert';
import axios from 'axios';
import React, { forwardRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'reactstrap';
import { checkDateValue } from '../../utility/Utils';
const CustomTableReport = forwardRef(
  (
    {
      filters,
      url,
      paginationServer,
      handleClickEvent,
      loadStyle = 'normal',
      customColumn = [],
      ignoreColumn = [],
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const generateColumns = (Keys) => {
      setColumns([
        ...Keys.map((x) => ({
          name: t(`${x}`),
          selector: x,
          sortable: true,
          minWidth: '12%',
          maxWidth: '12%',
        })),
        ...customColumn,
      ]);
    };
    const fetchDate = async (params = '') => {
      try {
        setLoading(true);
        // !back
        const response = await axios.get(`${url}${params}`);
        if (response) {
          if (response.data) {
            // delete result value from array, come from procedure
            response.data[0].pop()
            if (response.data[0].length) {
              const Keys = Object.keys(response.data[0][0]);
              generateColumns(Keys.filter((x) => !ignoreColumn.includes(x)));
              setData(response.data[0]);
            }
            else {
              return throws(new Error())
            }
          } else {
            setData([]);
          }
        }
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    const triggerFilters = async () => {
      try {
        const _filter = checkDateValue(filters);
        const _params = await convertObjectToParam(_filter);
        fetchDate(_params);
      } catch (e) {
        console.error('hacker_it error', e);
      }
    };
    useEffect(() => {
      triggerFilters();
    }, [filters]);
    return !data.length || !columns.length ? null : (
      <DataTable
        noHeader
        pagination
        paginationServer={paginationServer}
        striped
        columns={columns}
        paginationPerPage={10}
        onRowClicked={handleClickEvent}
        className="react-dataTable"
        progressPending={loading}
        progressComponent={(() => {
          if (loadStyle === 'spinner')
            return (
              <Spinner
                size="xl"
                color="secondary"
                style={{ width: '10rem', height: '10rem' }}
                className="float-left"
              />
            );
          else if (loadStyle === 'dots')
            return <LoaderDots size="medium" theme="muted" />;
          else
            return (
              <h3 className="p-5">
                {t("Loading...")}
              </h3>
            );
        })()}
        sortIcon={<ChevronDown size={10} />}
        data={data}
      />
    );
  }
);

export default CustomTableReport;
