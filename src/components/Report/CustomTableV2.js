import { checkDateValue, convertObjectToParam, fixValue, getTotalRows } from '@utils';
import axios from 'axios';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle, useState
} from 'react';
import { ArrowDown, ArrowUp } from 'react-feather';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';
import Empty from '../Empty';
const PER_PAGE = 10
const CustomTableReport = forwardRef(
  (
    { filters, url, ignoreTotalKeys = [], loadStyle = "normal" },
    ref
  ) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([])
    useImperativeHandle(ref, () => ({
      getData: () => data.length ?
        [...data,
        getTotalRows({
          data, ignoreTotalKeys
        })
        ] : []
    }));
    const generateColumns = (Keys) => {
      setColumns(Keys.map(key => (
        {
          Header: t(`${key}`),
          accessor: key,
        }
      )))
    }
    const fetchDate = async (params = "") => {
      try {
        setLoading(true);
        // !back
        const response = await axios.get(`${url}${params}`);
        response.data[0].pop()
        if (!(!!response && !!response.data && !!response.data[0] && !!response.data[0][0])) throw new Error("data wrong")
        const Keys = Object.keys(response.data[0][0])
        generateColumns(Keys)
        setData(response.data[0]);
      } catch (e) {
        console.error("hacker_it error", e)
        setData([])
      } finally {
        setLoading(false)
      }
    };
    const triggerFilter = async () => {
      try {
        const _filter = checkDateValue(filters)
        const _params = await convertObjectToParam(_filter)
        fetchDate(_params)
      } catch (e) {
        console.error("hacker_it error", e)
      }
    }
    useEffect(() => {
      triggerFilter()
    }, [filters]);
    const defaultColumn = React.useMemo(
      () => ({
        minWidth: 100,
        width: 150,
        maxWidth: 350,
      }),
      []
    )
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      pageOptions,
      gotoPage,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0, pageSize: PER_PAGE }
      },
      useBlockLayout,
      useResizeColumns,
      useSortBy,
      usePagination,
    )
    const getKeysHasNumberVale = useCallback(() =>
      Object.entries(data[0])
        .filter(([key, val]) => !ignoreTotalKeys.includes(key) && (!!val || val === 0) && !isNaN(+val))
      , [data, ignoreTotalKeys])
    const getFinalTotalRows = () => {
      return getKeysHasNumberVale().
        map(function ([key, _], i) {
          return (
            <div key={i} className="col-md-3 d-flex border-left">
              <h6 className="pr-1 font-weight-bolder">
                {t(`${key.toString()}`)}
              </h6>
              {
                data
                  .reduce(
                    (sum, row) =>
                      +row[key] + sum,
                    0
                  )
                  .toFixed(2)
              }
            </div>
          );
        })
    }

    return (
      !data.length || !columns.length ?
        <Empty />
        :
        <>

          <div {...getTableProps()} className="react-table">
            <div className="rt_TableHead">
              {headerGroups.map(headerGroup => (
                <div {...headerGroup.getHeaderGroupProps()} className="rt_TableHeadRow">
                  {headerGroup.headers.map(column => (
                    <div {...column.getHeaderProps()} className="rt_TableCol">
                      <div {...column.getSortByToggleProps()}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <ArrowDown className='ml-1' size={15} />
                              : <ArrowUp className='ml-1' size={15} />
                            : ""}
                        </span>
                      </div>
                      {/* Use column.getResizerProps to hook up the events correctly */}
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''
                          }`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div {...getTableBodyProps()} className="rt_TableBody">
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <div {...row.getRowProps()} className="rt_TableRow">
                    {row.cells.map(cell => {
                      return (
                        <div {...cell.getCellProps()} className="rt_TableCell">
                          {fixValue(cell.value)}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
          <div className='container'>
            <div className="p-1 row border-top border-bottom">
              {getFinalTotalRows()}
            </div>
            <ReactPaginate
              previousLabel={''}
              nextLabel={''}
              pageCount={pageOptions.length}
              initialPage={pageIndex}
              forcePage={pageIndex}
              activeClassName="active"
              onPageChange={(page) => gotoPage(page.selected)}
              pageClassName={'page-item'}
              nextLinkClassName={'page-link'}
              nextClassName={'page-item next'}
              previousClassName={'page-item prev'}
              previousLinkClassName={'page-link'}
              pageLinkClassName={'page-link'}
              containerClassName={
                'pagination react-paginate justify-content-end my-2 pr-1'
              }
            />
          </div>
        </>
    );
  }
);

export default CustomTableReport;
