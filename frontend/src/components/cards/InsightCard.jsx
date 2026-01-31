const getColor = (text) => {
  if (text.toLowerCase().includes("overspent")) return "#fee2e2";
  if (text.toLowerCase().includes("increased")) return "#fff7ed";
  if (text.toLowerCase().includes("good")) return "#ecfdf5";
  return "#f3f4f6";
};

const InsightCard = ({ text }) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "6px",
        background: getColor(text),
        border: "1px solid #ddd",
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default InsightCard;
