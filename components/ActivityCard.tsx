
import React from 'react';
import type { Activity } from '../types';
import { EditableText } from './EditableText';

interface ActivityCardProps {
  activity: Activity;
  isDraggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, activityId: string) => void;
  onEdit: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isDraggable, onDragStart, onEdit }) => {
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && onDragStart(e, activity.id)}
      className={`bg-white rounded-lg shadow-sm p-3 flex items-center relative transition-shadow hover:shadow-md ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      <div className="w-1.5 h-full absolute right-0 top-0 rounded-r-lg" style={{ backgroundColor: activity.accentColor }} />
      <EditableText 
        text={activity.name}
        fontSize={activity.fontSize}
        onEdit={onEdit}
        className="w-full"
      />
    </div>
  );
};
