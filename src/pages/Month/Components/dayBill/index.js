import classNames from "classnames";
import "./index.scss";
import { useMemo, useState } from "react";
import Icon from "@/components/icon";

const DailyBill = ({ date, billList }) => {
  //   console.log(billList);
  // Calculating the total income and outcome for the current month
  const dayResult = useMemo(() => {
    let totalIncomeInDay = 0;
    let totalPayInDay = 0;

    // Early return if billList is not set
    if (!billList) {
      return {
        totalIncomeInDay,
        totalPayInDay,
        total: totalIncomeInDay + totalPayInDay,
      };
    }

    // Calculating total income
    totalIncomeInDay = billList
      .filter((item) => item.type === "income")
      .reduce((a, c) => a + c.money, 0);

    // Calculating total outcome
    totalPayInDay = billList
      .filter((item) => item.type === "pay")
      .reduce((a, c) => a + c.money, 0);

    return {
      totalIncomeInDay,
      totalPayInDay,
      total: totalIncomeInDay + totalPayInDay,
    };
  }, [billList]);

  const [dayClick, setDayClick] = useState(false);

  const show = () => {
    setDayClick(!dayClick);
  };
  return (
    <div className={classNames("dailyBill")}>
      <div className="header">
        <div className="dateIcon">
          <span className="date">{date}</span>
          {/* expand 有这个类名 展开的箭头朝上的样子 */}
          <span
            className={classNames("arrow", { expand: dayClick })}
            onClick={show}
          ></span>
        </div>
        <div className="oneLineOverview">
          <div className="pay">
            <span className="type">Pay</span>
            <span className="money">{dayResult.totalPayInDay}</span>
          </div>
          <div className="income">
            <span className="type">Income</span>
            <span className="money">{dayResult.totalIncomeInDay}</span>
          </div>
          <div className="balance">
            <span className="money">{dayResult.total}</span>
            <span className="type">Sum</span>
          </div>
        </div>
      </div>
      <div
        className={classNames("billList")}
        style={{ display: dayClick ? "block" : "none" }}
      >
        {billList.map((item) => {
          return (
            <div className="bill" key={item.id}>
              {/* 图标 */}
              <Icon type={item.useFor} />
              <div className="detail">
                <div className="billType">{item.useFor}</div>
              </div>
              <div className={classNames("money", item.type)}>
                {item.money.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DailyBill;
