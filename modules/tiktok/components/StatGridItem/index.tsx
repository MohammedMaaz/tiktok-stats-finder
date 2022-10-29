import React from "react";

interface Props {
  heading: string;
  value: number;
  format?: "count" | "percentage";
}

function StatGridItem(props: Props) {
  const { heading, value, format = "count" } = props;

  return (
    <div className="py-24 border-y border-outline-light">
      <div className="font-semibold px-16 border-x border-outline-light">
        <h5 className="text-medium text-caption1">{heading}</h5>
        <span className="text-dark text-heading1">
          {format === "percentage"
            ? `${Math.round(value)}%`
            : `${Math.round(value).toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

export default StatGridItem;
