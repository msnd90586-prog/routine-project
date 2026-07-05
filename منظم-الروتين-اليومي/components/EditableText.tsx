
import React from 'react';
import type { FontSize } from '../types';

interface EditableTextProps {
  text: string;
  fontSize: FontSize;
  color?: string;
  onEdit: () => void;
  className?: string;
}

const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
    </svg>
);


export const EditableText: React.FC<EditableTextProps> = ({ text, fontSize, color, onEdit, className }) => {
  return (
    <div
      className={`group relative cursor-pointer inline-flex items-center gap-2 transition-colors duration-200 hover:bg-gray-100 p-1 rounded-md ${className}`}
      onClick={onEdit}
    >
      <span className={fontSize} style={{ color: color }}>{text}</span>
      <div className="absolute -left-5 opacity-0 group-hover:opacity-70 transition-opacity duration-200">
         <EditIcon className="text-gray-500"/>
      </div>
    </div>
  );
};
