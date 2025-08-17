import React from "react";
import { BsPlusLg } from "react-icons/bs";

export enum ContentItem {
  NOTE = "NOTE",
  HABIT = "HABIT",
}

interface AddButtonProps {
  contentItem: ContentItem;
  onClick?: () => void;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  contentItem,
  onClick,
  className = "",
}) => {
  const getButtonText = () => {
    switch (contentItem) {
      case ContentItem.NOTE:
        return "Add Note";
      case ContentItem.HABIT:
        return "Add Habit";
      default:
        return "Add";
    }
  };

  return (
    <button
      className={`fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 ${className}`}
      onClick={onClick}
      title={getButtonText()}
    >
      <BsPlusLg size={24} />
    </button>
  );
};

export default AddButton;
