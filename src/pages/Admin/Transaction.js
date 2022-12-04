import { useState } from "react";
import React, {
    Container,
    Table,
  }
from "react-bootstrap";
import { API } from "../../config/api";
import { useQuery } from "react-query";

const Transaction = () => {
  const title = "Income Transaction";
  document.title = "WaysBucks | " + title;

  // modal
  const [showTrans, setShowTrans] = useState(false);
  const [idOrder, setIdOrder] = useState(null);

  const handleClose = () => setShowTrans(false);
  const handleShow = (id) => {
    setIdOrder(id);
    setShowTrans(true);
  };

  // Fetching product data from database
  let { data: transactions } = useQuery("transactionsCache", async () => {
    const response = await API.get("/transactions");
    return response.data.data;
  });

    return (
      <Container>
      <h2 className="mt-5" style={{color: "red"}}>Income Transaction</h2>
      <Table className="border border-2 my-5" bordered hover responsive>
        <thead style={{ backgroundColor: "#E5E5E5" }}>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Address</th>
            <th>Post Code</th>
            <th>Income</th>            
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {transactions?.map((item, index) => (
          <tr
            onClick={() => handleShow(item?.id)}
            key={index}
            className={item.status === "" ? "dnone" : ""}
            >
            <td>{index + 1}</td>
            <td>{item?.user.name}</td>
            <td>{item?.user.profile?.address}</td>
            <td>{item?.user.profile?.postal_code}</td>
            <td className="tablePrice">{item?.total}</td>
            <td className={
                      item?.status === "Success"
                        ? "tableSuccess"
                        : item?.status === "Cancel"
                        ? "tableCancel"
                        : item?.status === "pending"
                        ? "tableWaiting"
                        : "tableOtw"
                    }>
             {item?.status}
            </td>            
          </tr>
        ))}
        </tbody>
      </Table>
    </Container>
    );
}

export default Transaction;