import React, { useState, useRef, useEffect } from 'react';

const VerticalDraggable = () => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTop, setStartTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggableRef.current) return;
    
    setIsDragging(true);
    setStartY(e.clientY);
    const computedStyle = window.getComputedStyle(draggableRef.current);
    setStartTop(parseInt(computedStyle.top));
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggableRef.current || !parentRef.current) return;

    const deltaY = e.clientY - startY;
    let newTop = startTop + deltaY;

    // Получаем границы
    const parentHeight = parentRef.current.offsetHeight;
    const draggableHeight = draggableRef.current.offsetHeight;

    // Ограничиваем перемещение
    newTop = Math.max(0, Math.min(parentHeight - draggableHeight, newTop));

    draggableRef.current.style.top = `${newTop}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startTop]);

  return (
    <div 
      ref={parentRef}
      style={{
        position: 'relative',
        width: '200px',
        height: '400px',
        backgroundColor: '#f0f0f0',
        border: '2px solid #333',
        margin: '20px',
        overflow: 'hidden'
      }}
    >
      <div
        ref={draggableRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          backgroundColor: '#3498db',
          borderRadius: '8px',
          cursor: 'move',
          top: '0',
          left: '50px'
        }}
      />
    </div>
  );
};

export default VerticalDraggable;