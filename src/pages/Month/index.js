import { NavBar, DatePicker } from "antd-mobile";
import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { getBillList } from "@/store/modles/billStore";
import _ from "lodash";

const Month = () => {
  const [dateVisible, setDateVisable] = useState(false);

  // 获取数据
  const dispatch = useDispatch(); // 使用useDispatch触发获得数据
  useEffect(() => {
    dispatch(getBillList());
  }, [dispatch]);

  const dataList = useSelector((state) => {
    return state.bill.billList;
  });
  // console.log(dataList);
  const monthGroup = useMemo(() => {
    return _.groupBy(dataList, (item) => dayjs(item.date).format("YYYY-MM"));
  }, [dataList]);
  // console.log(monthGroup);

  // settime
  const [parsedDate, setParsedDate] = useState(dayjs().format("YYYY-MM"));
  const confirm = (date) => {
    setDateVisable(false);
    // console.log(date); Thu Dec 01 2022 00:00:00 GMT+1100 (Australian Eastern Daylight Time)

    // 设置时间
    const parsedDate = dayjs(date).format("YYYY-MM");
    // console.log(parsedDate);
    setParsedDate(parsedDate);
    console.log(monthGroup[parsedDate]);
  };

  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        Month bill
      </NavBar>
      <div className="content">
        <div className="header">
          {/* 时间切换区域 */}
          <div className="date" onClick={() => setDateVisable(true)}>
            <span className="text">{parsedDate} Statement</span>
            {/* 思路：根据当前弹框打开的状态控制expand类名是否存在 */}
            <span
              className={classNames("arrow", { expand: dateVisible })}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">100</span>
              <span className="type">Outcome</span>
            </div>
            <div className="item">
              <span className="money">200</span>
              <span className="type">Income</span>
            </div>
            <div className="item">
              <span className="money">100</span>
              <span className="type">Sum</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className="kaDate"
            title="Bill date"
            precision="month"
            visible={dateVisible}
            // onCancel={() => setDateVisible(false)}
            // onConfirm={onConfirm}
            // onClose={() => setDateVisible(false)}
            max={new Date()}
            onClose={() => {
              setDateVisable(false);
            }}
            onConfirm={confirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Month;
