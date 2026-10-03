"use client";

import { useState } from "react";
import { MAX_TEXT_LENGTH } from "@/config/constants";

type ToneFormProps = {
  isLoading: boolean;
  onSubmit: (text: string) => void;
};

const ToneForm = ({ isLoading, onSubmit }: ToneFormProps) => {
  const [text, setText] = useState("");

  const trimmedLength = text.trim().length;
  const isSubmitDisabled = isLoading || trimmedLength === 0;

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmit(text);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={MAX_TEXT_LENGTH}
        rows={6}
        placeholder="Paste the message you are about to send..."
        className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {text.length}/{MAX_TEXT_LENGTH}
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {isLoading ? "Checking..." : "Check tone"}
        </button>
      </div>
    </div>
  );
};

export default ToneForm;