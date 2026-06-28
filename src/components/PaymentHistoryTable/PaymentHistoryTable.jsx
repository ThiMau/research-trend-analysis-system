import "./PaymentHistoryTable.css";

export default function PaymentHistoryTable({ history }) {
  return (
    <div className="payment-history">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty">
                No payment history
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.transactionId}>
                <td>
                  {new Date(item.transactionDate).toLocaleDateString()}
                </td>
                <td>{item.paymentMethod}</td>
                <td>
                  {Number(item.amountPaid).toLocaleString()} VNĐ
                </td>
                <td>
                  <span className={`status ${item.transactionStatus}`}>
                    {item.transactionStatus}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}