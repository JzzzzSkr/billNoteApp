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
  const [currentMonthList, setCurrentMonthList] = useState([]);
  // State to store the currently selected date in YYYY-MM format
  const [parsedDate, setParsedDate] = useState(dayjs().format("YYYY-MM"));

  // Retrieving the list of bills from Redux state
  const dataList = useSelector((state) => state.bill.billList);

  // Grouping the data list by month using lodash and memoizing the result
  const monthGroup = useMemo(
    () => _.groupBy(dataList, (item) => dayjs(item.date).format("YYYY-MM")),
    [dataList]
  );

  // Effect to set the current month's bill list on component mount and when monthGroup changes
  useEffect(() => {
    setCurrentMonthList(monthGroup[dayjs().format("YYYY-MM")]);
  }, [monthGroup]);

  // Calculating the total income and outcome for the current month
  const monResult = useMemo(() => {
    let totalIncomeInMonth = 0;
    let totalPayInMonth = 0;

    // Early return if currentMonthList is not set
    if (!currentMonthList) {
      return {
        totalIncomeInMonth,
        totalPayInMonth,
        total: totalIncomeInMonth + totalPayInMonth,
      };
    }

    // Calculating total income
    totalIncomeInMonth = currentMonthList
      .filter((item) => item.type === "income")
      .reduce((a, c) => a + c.money, 0);

    // Calculating total outcome
    totalPayInMonth = currentMonthList
      .filter((item) => item.type === "pay")
      .reduce((a, c) => a + c.money, 0);

    return {
      totalIncomeInMonth,
      totalPayInMonth,
      total: totalIncomeInMonth + totalPayInMonth,
    };
  }, [currentMonthList]);

  // Function to handle date confirmation from the date picker
  const confirm = (date) => {
    setDateVisible(false);
    const newParsedDate = dayjs(date).format("YYYY-MM");
    setParsedDate(newParsedDate);
    setCurrentMonthList(monthGroup[newParsedDate]);
  };

  // 当前月按照日来分组
  // console.log(currentMonthList);
  const dailyList = useMemo(() => {
    const dayBill = _.groupBy(
      currentMonthList,
      (item) => dayjs(item.date).utc().format("YYYY-MM-DD") // 将 UTC 时间转换为本地时间
    );

    const keys = Object.keys(dayBill).sort((a, b) => b.localeCompare(a));;
    return {
      dayBill,
      keys,
    };
  }, [currentMonthList]);

  // console.log(dailyList);

  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        Month bill
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
                {monResult.totalPayInMonth.toFixed(2)}
              </span>
              <span className="type">Outcome</span>
            </div>
            <div className="item">
              <span className="money">
                {monResult.totalIncomeInMonth.toFixed(2)}
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
