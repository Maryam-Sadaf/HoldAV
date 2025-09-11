import React from "react";

interface ToolbarProps {
  onTimeFormatStateChange?: (isChecked: boolean) => void;
  timeFormatState: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onTimeFormatStateChange,
  timeFormatState,
}) => {
  const handleTimeFormatStateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onTimeFormatStateChange) {
      onTimeFormatStateChange(e.target.checked);
    }
  };

  return (
    <div className="hidden time-format-section">
      <label className="time-format-chkbx">
        Time format:
        <input
          type="checkbox"
          checked={timeFormatState}
          onChange={handleTimeFormatStateChange}
        />
        <div className="chkbx-text"></div>
      </label>
    </div>
  );
};

export default Toolbar;
