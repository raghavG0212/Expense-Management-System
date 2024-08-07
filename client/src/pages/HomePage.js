import React, { useState, useEffect } from "react";
import { Input, Modal, Form, Select, message, Table, DatePicker } from "antd";
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const {RangePicker} = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate,setSelectedDate]= useState(null);
  const [type,setType]= useState("all");
  const [viewData,setViewData]= useState('table');
  const [editable,setEditable]= useState(null);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render : (text)=> <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "refrence",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title:"Actions",
      render:(text,record) =>(
        <div>
          <EditOutlined className="editing" onClick={()=>{
            setEditable(record)
            setShowModal(true)
          }}/>
          <DeleteOutlined className="deleting mx-2" onClick={()=>{handleDelete(record)}}/>
        </div>
      )
    } 
  ];

 useEffect(() => {
   const getAllTransactions = async () => {
     try {
       const user = JSON.parse(localStorage.getItem("user"));
       setLoading(true);
       const res = await axios.post("/transactions/get-transaction", {
         userid: user._id,
         frequency,
         type,
         selectedDate: selectedDate
           ? [
               selectedDate[0].format("YYYY-MM-DD"),
               selectedDate[1].format("YYYY-MM-DD"),
             ]
           : [], 
       });
       setLoading(false);
       setAllTransactions(res.data);
       console.log(res.data);
     } catch (error) {
       console.log(error);
       message.error("Failed to get Transaction");
     }
   };
   if (frequency === "custom" && selectedDate) {
     getAllTransactions();
   } else if (frequency !== "custom") {
     getAllTransactions();
   }
 }, [frequency, selectedDate,type]);

  const handleDelete= async(record)=>{
    try{
      setLoading(true)
      await axios.post("/transactions/delete-transaction",{transactionId:record._id})
      setLoading(false)
      message.success("Transaction Deleted")
    }
    catch(error){
      setLoading(false)
      console.log(error)
      message.error("Unable to Delete")
    }
  }

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if(editable){
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionId : editable._id,
        });
        setLoading(false);
        message.success("transaction Updated Successfully");
      }
      else{
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };
  return (
    <Layout className='layout'>
      {loading && <Spinner />}
      <div className="filters">
        <div className="date">
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div className="type">
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData==='table' ?
        <Table columns={columns} dataSource={allTransactions} />:
        <Analytics allTransactions={allTransactions}/>
        }
      </div>
      <Modal
        title= {editable ? 'Edit transaction' : 'Add transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Refrence" name="refrence">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
