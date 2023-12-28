import { NavBar, DatePicker } from "antd-mobile";
import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useSelector } from "react-redux";
import _ from "lodash";
import DailyBill from "./Components/dayBill/index";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc) // 设置utc时区


const Month = () => {
  // State to control visibility of date picker
  const [dateVisible, setDateVisible] = useState(false);
  // State to store the list of bills for the current month
  const [currentYearList, setCurrentYearList] = useState([]);
  // State to store the currently selected date in YYYY-MM format
  const [parsedDate, setParsedDate] = useState(dayjs().format("YYYY"));

  // Retrieving the list of bills from Redux state
  const dataList = useSelector((state) => state.bill.billList);

  // Grouping the data list by month using lodash and memoizing the result
  const yearGroup = useMemo(
    () => _.groupBy(dataList, (item) => dayjs(item.date).format("YYYY")),
    [dataList]
  );

  // Effect to set the current month's bill list on component mount and when yearGroup changes
  useEffect(() => {
    setCurrentYearList(yearGroup[dayjs().format("YYYY")]);
  }, [yearGroup]);

  // Calculating the total income and outcome for the current month
  const monResult = useMemo(() => {
    let totalIncomeInYear = 0;
    let totalPayInYear = 0;

    // Early return if currentYearList is not set
    if (!currentYearList) {
      return {
        totalIncomeInYear,
        totalPayInYear,
        total: totalIncomeInYear + totalPayInYear,
      };
    }

    // Calculating total income
    totalIncomeInYear = currentYearList
      .filter((item) => item.type === "income")
      .reduce((a, c) => a + c.money, 0);

    // Calculating total outcome
    totalPayInYear = currentYearList
      .filter((item) => item.type === "pay")
      .reduce((a, c) => a + c.money, 0);

    return {
      totalIncomeInYear,
      totalPayInYear,
      total: totalIncomeInYear + totalPayInYear,
    };
  }, [currentYearList]);

  // Function to handle date confirmation from the date picker
  const confirm = (date) => {
    setDateVisible(false);
    const newParsedDate = dayjs(date).format("YYYY");
    setParsedDate(newParsedDate);
    setCurrentYearList(yearGroup[newParsedDate]);
  };

  // 当前月按照日来分组
  // console.log(currentYearList);
  const dailyList = useMemo(() => {
    const dayBill = _.groupBy(
      currentYearList,
      (item) => dayjs(item.date).utc().format("YYYY") // 将 UTC 时间转换为本地时间
    );

    const keys = Object.keys(dayBill).sort((a, b) => b.localeCompare(a));;
    return {
      dayBill,
      keys,
    };
  }, [currentYearList]);

  // console.log(dailyList);

  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        Year bill
      </NavBar>
      <div className="content">
        <div className="header">
          <div className="date" onClick={() => setDateVisible(true)}>
            <span className="text">{parsedDate} Statement</span>
            <span
              className={classNames("arrow", { expand: dateVisible })}
            ></span>
          </div>
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">
                {monResult.totalPayInYear.toFixed(2)}
              </span>
              <span className="type">Outcome</span>
            </div>
            <div className="item">
              <span className="money">
                {monResult.totalIncomeInYear.toFixed(2)}
              </span>
              <span className="type">Income</span>
            </div>
            <div className="item">
              <span className="money">{monResult.total.toFixed(2)}</span>
              <span className="type">Sum</span>
            </div>
          </div>
          <DatePicker
            className="kaDate"
            title="Bill date"
            precision="month"
            visible={dateVisible}
            max={new Date()}
            onClose={() => setDateVisible(false)}
            onConfirm={confirm}
          />
        </div>
        {/* {单日列表统计} */}
        {dailyList.keys.map((item) => {
          return (
            <DailyBill
              key={item}
              billList={dailyList.dayBill[item]}
              date={item}
            ></DailyBill>
          );
        })}
      </div>
    </div>
  );
};

export default Month;
