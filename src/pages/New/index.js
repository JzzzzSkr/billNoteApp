import { Button, DatePicker, Input, NavBar } from "antd-mobile";
import Icon from "@/components/icon";
import "./index.scss";
import classNames from "classnames";
import { billListData } from "@/contants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addBillList } from "@/store/modles/billStore";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const New = () => {
  const navigate = useNavigate();
  // 1. Prepare a state to control income and expenditure
  const [billType, setBillType] = useState("pay"); // pay-expenditure income-income

  // Collect amount
  const [money, setMoney] = useState(0);
  const moneyChange = (value) => {
    setMoney(value);
  };

  // Collect bill type
  const [useFor, setUseFor] = useState("");
  const dispatch = useDispatch();
  // Save the bill
  const saveBill = () => {
    // Collect form data
    const data = {
      type: billType,
      money: billType === "pay" ? -money : +money,
      date: date,
      useFor: useFor,
    };
    console.log(data);
    dispatch(addBillList(data));
  };
  // Store selected time
  const [date, setDate] = useState();
  // Control the opening and closing of time
  const [dateVisible, setDateVisible] = useState(false);
  // Confirm selected time
  const dateConfirm = (value) => {
    console.log(value);
    setDate(value);
    setDateVisible(false);
  };
  return (
    <div className="keepAccounts">
      <NavBar className="nav" onBack={() => navigate(-1)}>
        Record a Note
      </NavBar>

      <div className="header">
        <div className="kaType">
          <Button
            shape="rounded"
            className={classNames(billType === "pay" ? "selected" : "")}
            onClick={() => setBillType("pay")}
          >
            Expenditure
          </Button>
          <Button
            className={classNames(billType === "income" ? "selected" : "")}
            shape="rounded"
            onClick={() => setBillType("income")}
          >
            Income
          </Button>
        </div>

        <div className="kaFormWrapper">
          <div className="kaForm">
            <div className="date">
              <Icon type="calendar" className="icon" />
              <span className="text" onClick={() => setDateVisible(true)}>
                {dayjs(date).format("YYYY-MM-DD")}
              </span>
              {/* Date Picker */}
              <DatePicker
                className="kaDate"
                title="Accounting Date"
                max={new Date()}
                visible={dateVisible}
                onConfirm={dateConfirm}
              />
            </div>
            <div className="kaInput">
              <Input
                className="input"
                placeholder="0.00"
                type="number"
                value={money}
                onChange={moneyChange}
              />
              <span className="iconYuan">¥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="kaTypeList">
        {/* Data area */}
        {billListData[billType].map((item) => {
          return (
            <div className="kaType" key={item.type}>
              <div className="title">{item.name}</div>
              <div className="list">
                {item.list.map((item) => {
                  return (
                    // selected
                    <div
                      className={classNames(
                        "item",
                        useFor === item.type ? "selected" : ""
                      )}
                      key={item.type}
                      onClick={() => setUseFor(item.type)}
                    >
                      <div className="icon">
                        <Icon type={item.type} />
                      </div>
                      <div className="text">{item.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="btns">
        <Button className="btn save" onClick={saveBill}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default New;
