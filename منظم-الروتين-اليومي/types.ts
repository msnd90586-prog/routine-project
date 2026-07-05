
export type Pattern = 'A' | 'B';
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';

export interface Activity {
  id: string;
  name: string;
  accentColor: string;
  fontSize: FontSize;
}

export interface TimeSlot {
  id: string;
  name: string;
  fontSize: FontSize;
  activityA?: Activity;
  activityB?: Activity;
  commonActivity?: Activity;
}

export interface EditableItem {
  type: 'mainTitle' | 'subTitle' | 'patternADesc' | 'patternBDesc' | 'timeSlot' | 'activity';
  id?: string;
  pattern?: Pattern;
}

export interface EditModalData extends EditableItem {
  currentText: string;
  currentFontSize: FontSize;
  currentColor: string;
}
