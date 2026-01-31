const getStyles = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("exceeded") || lower.includes("overspent")) {
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      label: "Alert",
    };
  }

  if (lower.includes("increase") || lower.includes("near")) {
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      label: "Warning",
    };
  }

  return {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    label: "Insight",
  };
};

const InsightCard = ({ text }) => {
  const styles = getStyles(text);

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-xl p-5 space-y-2`}
    >
      <span
        className={`text-xs font-medium uppercase ${styles.text}`}
      >
        {styles.label}
      </span>
      <p className="text-sm text-gray-800 leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default InsightCard;
