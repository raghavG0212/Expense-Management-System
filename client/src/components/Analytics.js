import React from "react";
import { Progress } from "antd";

const Analytics = ({ allTransactions }) => {
  const totalTransaction = allTransactions.length;
  const totalIncomeTransactions = allTransactions.filter(
    (transactions) => transactions.type === "income"
  );
  const totalExpenseTransactions = allTransactions.filter(
    (transactions) => transactions.type === "expense"
  );
  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100;

  //turnover
  const turnover = allTransactions.reduce(
    (acc, transactions) => acc + transactions.amount,
    0
  );
  const totalIncomeTurnover = allTransactions
    .filter((transactions) => transactions.type === "income")
    .reduce((acc, transactions) => acc + transactions.amount, 0);
  const totalExpenseTurnover = allTransactions
    .filter((transactions) => transactions.type === "expense")
    .reduce((acc, transactions) => acc + transactions.amount, 0);
  const totalIncomeTurnoverPercent = (totalIncomeTurnover / turnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / turnover) * 100;

  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];

  return (
    <div className="row m-3">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            Total Transactions : {totalTransaction}
          </div>
          <div className="card-body">
            <h5 className="text-success">
              Income : {totalIncomeTransactions.length}
            </h5>
            <h5 className="text-danger">
              Expense : {totalExpenseTransactions.length}
            </h5>
            <div>
              <Progress
                type="circle"
                strokeColor={"green"}
                className="mx-2"
                percent={totalIncomePercent.toFixed(0)}
              />
              <Progress
                type="circle"
                strokeColor={"red"}
                className="mx-2"
                percent={totalExpensePercent.toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">Total Turnover : {turnover}</div>
          <div className="card-body">
            <h5 className="text-success">Income : {totalIncomeTurnover}</h5>
            <h5 className="text-danger">Expense : {totalExpenseTurnover}</h5>
            <div>
              <Progress
                type="circle"
                strokeColor={"green"}
                className="mx-2"
                percent={totalIncomeTurnoverPercent.toFixed(0)}
              />
              <Progress
                type="circle"
                strokeColor={"red"}
                className="mx-2"
                percent={totalExpenseTurnoverPercent.toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-5">
          <h4>Categorized Income</h4>
          {categories.map((category) => {
            const amount = allTransactions
              .filter(
                (transactions) =>
                  transactions.type === "income" &&
                  transactions.category === category
              )
              .reduce((acc, transactions) => acc + transactions.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalIncomeTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-5">
          <h4>Categorized Expense</h4>
          {categories.map((category) => {
            const amount = allTransactions
              .filter(
                (transactions) =>
                  transactions.type === "expense" &&
                  transactions.category === category
              )
              .reduce((acc, transactions) => acc + transactions.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
