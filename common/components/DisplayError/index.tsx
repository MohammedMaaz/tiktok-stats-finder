import React from "react";

interface Props {
  message: string;
}

function DisplayError({ message }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <img className="w-[250px] max-w-[90vw]" alt="error" src="/error.png" />
      <h1 className="text-heading1 text-dark font-semibold mt-4">
        Opps! There was an error
      </h1>
      <p className="text-subheader text-medium mt-24">
        <strong className="font-semibold">Error:</strong> {message}
      </p>
    </div>
  );
}

export default DisplayError;
