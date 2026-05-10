import React from "react";

const ReceiverMessage = ({ image, message, time }) => {
  return (
    <div className="flex w-full justify-start mb-3">
      <div
        className="
          max-w-[75%]
          bg-gray-200
          text-gray-900
          px-4 py-2
          rounded-2xl rounded-tl-none
          shadow-sm
          flex flex-col gap-2
          break-words
        "
      >
        {/* Image Message */}
        {image && (
          <img
            src={image}
            alt="received"
            className="w-[180px] max-h-[250px] object-cover rounded-lg"
          />
        )}

        {/* Text Message */}
        {message && (
          <p className="text-[16px] leading-relaxed">
            {message}
          </p>
        )}

        {/* Time */}
        {time && (
          <span className="text-[11px] text-gray-500 self-end">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReceiverMessage;