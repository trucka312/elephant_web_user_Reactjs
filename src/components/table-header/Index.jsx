import PropTypes from 'prop-types'
import { Button, DatePicker, Space } from "antd";
import Search from "antd/es/transfer/search";
import { useDebounced } from "../../hooks/useDebounce";
import { useEffect } from "react";

export default function TableHeader({
  onSearch,
  params,
  setParams,
  titleDatePicker1,
  titleDatePicker2,
  isStore
}) {
  const {
    search,
    begin_date_register,
    end_date_register,
    begin_last_visit_time,
    end_last_visit_time,
    begin_date_expried,
    end_date_expried
  } = params;
  let keywordSearch = useDebounced(search, 500);
  let query = `page=1&search=${search}&begin_date_register=${begin_date_register}&end_date_register=${end_date_register}&begin_last_visit_time=${begin_last_visit_time}&end_last_visit_time=${end_last_visit_time}`;
  let queryStore = `page=1&search=${search}&begin_date_register=${begin_date_register}&end_date_register=${end_date_register}&begin_date_expried=${begin_date_expried}&end_date_expried=${end_date_expried}`;

  useEffect(() => {
    onSearch(isStore ? queryStore : query);
  }, [keywordSearch]);

  const changeParams = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex justify-between my-3">
        <Space direction="vertical" style={{ width: 300 }} size="large">
          <Search
            placeholder="Tìm kiếm..."
            name="search"
            onChange={(e) => changeParams("search", e.target.value)}
          />
        </Space>
        <Button type="primary">Xuất Excel</Button>
      </div>

      <div className="flex justify-between my-5">
        <div>
          <p className="mb-2 font-semibold">{titleDatePicker1}:</p>
          <div>
            <span className="mr-1">Từ:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Từ ngày"
                onChange={(_, dateString) => changeParams("begin_date_register", dateString)}
            />
            <span className="mr-1 ml-2">Đến:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Đến ngày"
              onChange={(_, dateString) =>  changeParams("end_date_register", dateString)}
            />
            <Button type="primary ml-2" onClick={() => onSearch(query)} >Tìm kiếm</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">{titleDatePicker2}:</p>
          <div>
            <span className="mr-1">Từ:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Từ ngày"
              onChange={(_, dateString) =>  changeParams(`${ isStore ? 'begin_date_expried' : 'begin_last_visit_time'}`, dateString)}
            />
            <span className="mr-1 ml-2">Đến:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Đến ngày"
              onChange={(_, dateString) =>  changeParams(`${ isStore ? 'end_date_expried' : 'end_last_visit_time'}`, dateString)}
            />
            <Button type="primary ml-2" onClick={() => onSearch(isStore ? queryStore : query)}>Tìm kiếm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

TableHeader.propTypes = {
    titleDatePicker2: PropTypes.string,
    titleDatePicker1: PropTypes.string,
    setParams: PropTypes.func.isRequired,
    params: PropTypes.object,
    onSearch: PropTypes.func.isRequired,
    isStore: PropTypes.bool
}
