
import React, { useState, useEffect } from 'react';
import type { EditModalData, FontSize } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; fontSize: FontSize; color: string }) => void;
  data: EditModalData | null;
}

const fontSizes: { value: FontSize; label: string }[] = [
  { value: 'text-sm', label: 'صغير جدًا' },
  { value: 'text-base', label: 'صغير' },
  { value: 'text-lg', label: 'عادي' },
  { value: 'text-xl', label: 'كبير' },
  { value: 'text-2xl', label: 'كبير جدًا' },
  { value: 'text-3xl', label: 'ضخم' },
];

const colorSwatches = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#6b7280', '#06b6d4', '#f59e0b'
];

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, data }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (data) {
      setText(data.currentText);
      setFontSize(data.currentFontSize);
      setColor(data.currentColor);
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const handleSave = () => {
    onSave({ text, fontSize, color });
    onClose();
  };
  
  const isActivity = data.type === 'activity';
  const colorLabel = isActivity ? 'لون التمييز:' : 'لون الخط:';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">تعديل العنصر</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">النص:</label>
            <input
              id="text-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="font-size-select" className="block text-sm font-medium text-gray-700 mb-1">حجم الخط:</label>
            <select
              id="font-size-select"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as FontSize)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {fontSizes.map(fs => <option key={fs.value} value={fs.value}>{fs.label}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{colorLabel}</label>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map(swatch => (
                <button
                  key={swatch}
                  onClick={() => setColor(swatch)}
                  className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === swatch ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
               <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full border-none cursor-pointer"
                />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};
