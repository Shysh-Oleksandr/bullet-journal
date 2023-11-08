import React, { useMemo } from 'react';
import { MdSave, MdSaveAs } from 'react-icons/md';

interface NoteSavingIndicatorProps {
  isSaving: boolean;
  isLocked: boolean;
  hasChanges: boolean;
}

const NoteSavingIndicator = ({ isSaving, isLocked, hasChanges }: NoteSavingIndicatorProps) => {
  const label = useMemo(() => {
    if (isSaving) return "Saving...";

    if (hasChanges) return "Not saved";

    return "Locked";
  }, [hasChanges, isSaving]);

  const Icon = useMemo(() => {
    if (isSaving) return <MdSave />;

    if (hasChanges) return <MdSaveAs />;

    return null;
  }, [hasChanges, isSaving]);

  if (!hasChanges && !isSaving && !isLocked) return null;

  return (
    <div className="absolute right-0 bottom-3 italic text-lg fl text-cyan-900">
      <span className="text-[1.75rem] text-green-600 mr-1">
        {Icon}
      </span>
      {label}
    </div>
  );
};

export default NoteSavingIndicator;
