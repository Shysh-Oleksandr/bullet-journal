import React from 'react';

interface NoteImportanceInputProps {
    importance: number;
    setImportance: (value: React.SetStateAction<number>) => void;
    inputId: string;
}

const NoteImportanceInput = ({ importance, setImportance, inputId }: NoteImportanceInputProps) => {
    return (
        <input
            type="number"
            min={1}
            max={10}
            id={inputId}
            className="w-16 text-xl font-medium bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] px-2 py-1 rounded-sm text-[#6aaac2]"
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
        />
    );
};

export default NoteImportanceInput;
