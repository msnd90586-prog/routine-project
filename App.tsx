
import React, { useState, useRef, useCallback } from 'react';
import type { TimeSlot, Pattern, Activity, EditModalData, EditableItem, FontSize } from './types';
import { ActivityCard } from './components/ActivityCard';
import { EditableText } from './components/EditableText';
import { EditModal } from './components/EditModal';

const INITIAL_DATA: TimeSlot[] = [
    { id: 'ts1', name: 'بعد الفجر', fontSize: 'text-lg', activityA: { id: 'a1', name: 'دراسة خاصة', accentColor: '#3b82f6', fontSize: 'text-base' }, activityB: { id: 'b1', name: 'نوم', accentColor: '#8b5cf6', fontSize: 'text-base' } },
    { id: 'ts2', name: 'بعد الضحى', fontSize: 'text-lg', activityA: { id: 'a2', name: 'نوم', accentColor: '#8b5cf6', fontSize: 'text-base' }, activityB: { id: 'b2', name: 'دراسة خاصة', accentColor: '#3b82f6', fontSize: 'text-base' } },
    { id: 'ts3', name: 'بعد الظهر', fontSize: 'text-lg', activityA: { id: 'a3', name: 'تمارين جيم', accentColor: '#ec4899', fontSize: 'text-base' }, activityB: { id: 'b3', name: 'علم شرعي', accentColor: '#10b981', fontSize: 'text-base' } },
    { id: 'ts4', name: 'بعد العصر', fontSize: 'text-lg', commonActivity: { id: 'c1', name: 'عمل ثابت', accentColor: '#f97316', fontSize: 'text-base' } },
    { id: 'ts5', name: 'بعد العمل', fontSize: 'text-lg', commonActivity: { id: 'c2', name: 'نوم', accentColor: '#6b7280', fontSize: 'text-base' } },
];

const App: React.FC = () => {
    const [schedule, setSchedule] = useState<TimeSlot[]>(INITIAL_DATA);
    const [activePattern, setActivePattern] = useState<Pattern>('A');
    
    const [texts, setTexts] = useState({
        mainTitle: { text: 'منظم الروتين اليومي', fontSize: 'text-3xl' as FontSize, color: '#1f2937' },
        subTitle: { text: 'نظم يومك بين نمطين مختلفين بمرونة وسهولة', fontSize: 'text-base' as FontSize, color: '#6b7280' },
        patternADesc: { text: 'النمط أ: أيام الدراسة من المنزل', fontSize: 'text-lg' as FontSize, color: '#4b5563' },
        patternBDesc: { text: 'النمط ب: أيام الدراسة الخارجية', fontSize: 'text-lg' as FontSize, color: '#4b5563' }
    });

    const [modalData, setModalData] = useState<EditModalData | null>(null);
    const editingItemRef = useRef<EditableItem | null>(null);

    const dragInfo = useRef<{ activityId: string | null; sourceSlotId: string | null }>({ activityId: null, sourceSlotId: null });
    const swipeInfo = useRef<{ active: boolean, startX: number, element: HTMLDivElement | null }>({ active: false, startX: 0, element: null });
    const [swipeOffset, setSwipeOffset] = useState(0);

    const handleEditClick = (item: EditableItem) => {
        editingItemRef.current = item;
        let data: EditModalData | null = null;
        switch(item.type) {
            case 'mainTitle': data = { ...item, currentText: texts.mainTitle.text, currentFontSize: texts.mainTitle.fontSize, currentColor: texts.mainTitle.color }; break;
            case 'subTitle': data = { ...item, currentText: texts.subTitle.text, currentFontSize: texts.subTitle.fontSize, currentColor: texts.subTitle.color }; break;
            case 'patternADesc': data = { ...item, currentText: texts.patternADesc.text, currentFontSize: texts.patternADesc.fontSize, currentColor: texts.patternADesc.color }; break;
            case 'patternBDesc': data = { ...item, currentText: texts.patternBDesc.text, currentFontSize: texts.patternBDesc.fontSize, currentColor: texts.patternBDesc.color }; break;
            case 'timeSlot': {
                const slot = schedule.find(s => s.id === item.id);
                if (slot) data = { ...item, currentText: slot.name, currentFontSize: slot.fontSize, currentColor: '#374151' };
                break;
            }
            case 'activity': {
                const slot = schedule.find(s => s.id === item.id);
                const activityKey = slot?.commonActivity ? 'commonActivity' : item.pattern === 'A' ? 'activityA' : 'activityB';
                const activity = slot?.[activityKey as keyof TimeSlot] as Activity | undefined;
                if (activity) data = { ...item, currentText: activity.name, currentFontSize: activity.fontSize, currentColor: activity.accentColor };
                break;
            }
        }
        setModalData(data);
    };

    const handleSaveEdit = ({ text, fontSize, color }: { text: string; fontSize: FontSize; color: string }) => {
        const item = editingItemRef.current;
        if (!item) return;

        switch(item.type) {
            case 'mainTitle': setTexts(prev => ({ ...prev, mainTitle: { text, fontSize, color } })); break;
            case 'subTitle': setTexts(prev => ({ ...prev, subTitle: { text, fontSize, color } })); break;
            case 'patternADesc': setTexts(prev => ({ ...prev, patternADesc: { text, fontSize, color } })); break;
            case 'patternBDesc': setTexts(prev => ({ ...prev, patternBDesc: { text, fontSize, color } })); break;
            case 'timeSlot': {
                setSchedule(prev => prev.map(s => s.id === item.id ? { ...s, name: text, fontSize } : s));
                break;
            }
            case 'activity': {
                 setSchedule(prev => prev.map(s => {
                    if (s.id !== item.id) return s;
                    const slot = { ...s };
                    const activityKey = slot.commonActivity ? 'commonActivity' : item.pattern === 'A' ? 'activityA' : 'activityB';
                    const activity = slot[activityKey as keyof TimeSlot] as Activity | undefined;
                    if (activity) {
                        (slot[activityKey as keyof TimeSlot] as Activity) = { ...activity, name: text, fontSize, accentColor: color };
                    }
                    return slot;
                }));
                break;
            }
        }
    };
    
    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, activityId: string, sourceSlotId: string) => {
        dragInfo.current = { activityId, sourceSlotId };
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSlotId: string) => {
        e.preventDefault();
        const { activityId, sourceSlotId } = dragInfo.current;
        if (!activityId || !sourceSlotId || sourceSlotId === targetSlotId) return;

        const targetSlot = schedule.find(s => s.id === targetSlotId);
        if (targetSlot?.commonActivity) return; 

        let activityToMove: Activity | undefined;
        setSchedule(prev => {
            const newSchedule = [...prev];
            const sourceSlotIndex = newSchedule.findIndex(s => s.id === sourceSlotId);
            const targetSlotIndex = newSchedule.findIndex(s => s.id === targetSlotId);

            if (sourceSlotIndex === -1 || targetSlotIndex === -1) return prev;
            
            const sourceSlot = { ...newSchedule[sourceSlotIndex] };
            
            const activityKey = activePattern === 'A' ? 'activityA' : 'activityB';
            activityToMove = sourceSlot[activityKey];
            
            if (!activityToMove) return prev;

            delete sourceSlot[activityKey];
            newSchedule[sourceSlotIndex] = sourceSlot;
            
            const targetSlot = { ...newSchedule[targetSlotIndex] };
            targetSlot[activityKey] = activityToMove;
            newSchedule[targetSlotIndex] = targetSlot;

            return newSchedule;
        });
        
        dragInfo.current = { activityId: null, sourceSlotId: null };
    };

    // Swipe handlers
    const handleSwipeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        swipeInfo.current = { active: true, startX: clientX, element: e.currentTarget };
        e.currentTarget.style.transition = 'none';
    };

    const handleSwipeMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!swipeInfo.current.active) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const offset = clientX - swipeInfo.current.startX;
        setSwipeOffset(offset);
    }, []);

    const handleSwipeEnd = useCallback(() => {
        if (!swipeInfo.current.active || !swipeInfo.current.element) return;
        
        swipeInfo.current.element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

        const threshold = swipeInfo.current.element.clientWidth / 4;
        if (Math.abs(swipeOffset) > threshold) {
            setActivePattern(prev => prev === 'A' ? 'B' : 'A');
        }
        setSwipeOffset(0);
        swipeInfo.current = { active: false, startX: 0, element: null };
    }, [swipeOffset]);

    React.useEffect(() => {
        window.addEventListener('mousemove', handleSwipeMove);
        window.addEventListener('mouseup', handleSwipeEnd);
        window.addEventListener('touchmove', handleSwipeMove);
        window.addEventListener('touchend', handleSwipeEnd);
        return () => {
            window.removeEventListener('mousemove', handleSwipeMove);
            window.removeEventListener('mouseup', handleSwipeEnd);
            window.removeEventListener('touchmove', handleSwipeMove);
            window.removeEventListener('touchend', handleSwipeEnd);
        }
    }, [handleSwipeMove, handleSwipeEnd]);

    const patternDesc = activePattern === 'A' ? texts.patternADesc : texts.patternBDesc;

    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm:p-8 overflow-x-hidden">
            <header className="text-center mb-8">
                <EditableText
                    text={texts.mainTitle.text}
                    fontSize={texts.mainTitle.fontSize}
                    color={texts.mainTitle.color}
                    onEdit={() => handleEditClick({ type: 'mainTitle' })}
                    className="font-bold"
                />
                <div className="mt-2">
                    <EditableText
                        text={texts.subTitle.text}
                        fontSize={texts.subTitle.fontSize}
                        color={texts.subTitle.color}
                        onEdit={() => handleEditClick({ type: 'subTitle' })}
                    />
                </div>
            </header>

            <main className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                     <EditableText
                        text={patternDesc.text}
                        fontSize={patternDesc.fontSize}
                        color={patternDesc.color}
                        onEdit={() => handleEditClick({ type: activePattern === 'A' ? 'patternADesc' : 'patternBDesc' })}
                        className="font-bold"
                    />
                </div>

                <div className="overflow-hidden relative">
                    <div
                        className="flex w-full"
                        onMouseDown={handleSwipeStart}
                        onTouchStart={handleSwipeStart}
                        style={{ transform: `translateX(${swipeOffset}px)` }}
                    >
                        <div
                            className="w-full flex-shrink-0 transition-opacity duration-300"
                            style={{ opacity: swipeOffset !== 0 ? 1 - Math.abs(swipeOffset) / (swipeInfo.current.element?.clientWidth || 300) : 1 }}
                        >
                            <div className="space-y-4">
                                {schedule.map(slot => {
                                    const activity = slot.commonActivity || (activePattern === 'A' ? slot.activityA : slot.activityB);
                                    const isDraggable = !!(activePattern === 'A' ? slot.activityA : slot.activityB);

                                    return (
                                        <div key={slot.id} className="grid grid-cols-3 gap-4 items-center">
                                            <div className="col-span-1">
                                                <EditableText 
                                                    text={slot.name}
                                                    fontSize={slot.fontSize}
                                                    onEdit={() => handleEditClick({type: 'timeSlot', id: slot.id})}
                                                    className="text-gray-600 font-bold"
                                                />
                                            </div>
                                            <div 
                                                className="col-span-2 min-h-[60px]"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, slot.id)}
                                            >
                                                {activity && (
                                                    <ActivityCard
                                                        activity={activity}
                                                        isDraggable={isDraggable}
                                                        onDragStart={(e, activityId) => handleDragStart(e, activityId, slot.id)}
                                                        onEdit={() => handleEditClick({
                                                            type: 'activity', 
                                                            id: slot.id, 
                                                            pattern: slot.commonActivity ? undefined : activePattern
                                                        })}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            
            <div className="mt-8 flex justify-center items-center space-x-4 space-x-reverse">
                <button
                    onClick={() => setActivePattern('B')}
                    disabled={activePattern === 'B'}
                    className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="الانتقال إلى النمط ب"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => setActivePattern('A')}
                    disabled={activePattern === 'A'}
                    className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="الانتقال إلى النمط أ"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <EditModal 
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
                onSave={handleSaveEdit}
                data={modalData}
            />
        </div>
    );
};

export default App;
