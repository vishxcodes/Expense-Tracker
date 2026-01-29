const StatCard = ({ title, value }) => {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        minWidth: "180px",
      }}
    >
      <p style={{ color: "#666", marginBottom: "0.5rem" }}>
        {title}
      </p>
      <h2>{value}</h2>
    </div>
  );
};

export default StatCard;
