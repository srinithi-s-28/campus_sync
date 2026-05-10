import React from "react";

const SenderMessage = ({ image, message, time }) => {
  return (
    <div className="flex w-full justify-end mb-3">
      <div
        className="
          max-w-[75%]
          bg-[#1797C2]
          text-white
          px-4 py-2
          rounded-2xl rounded-tr-none
          shadow-sm
          flex flex-col gap-2
          break-words
        "
      >
        {/* Image */}
        {image && (
          <img
            src={image}
            alt="sent"
            className="w-[180px] max-h-[250px] object-cover rounded-lg"
          />
        )}

        {/* Message */}
        {message && (
          <p className="text-[16px] leading-relaxed">
            {message}
          </p>
        )}

        {/* Time */}
        {time && (
          <span className="text-[11px] text-white/70 self-end">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

export default SenderMessage;