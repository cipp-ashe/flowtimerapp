import React from 'react';

export const TitleBar = () => {
  const handleClose = async () => {
    try {
      await window.electron?.close();
    } catch (e) {
      console.error('Error closing:', e);
      window.close();
    }
  };

  return (
    <div className="h-8 bg-background border-b flex items-center justify-between px-4 fixed top-0 left-0 right-0 titlebar-drag-region">
      <div className="text-sm font-medium text-muted-foreground">FlowTime</div>
      <div className="window-controls">
        <button 
          className="window-control-button window-control-minimize titlebar-no-drag"
          onClick={() => window.electron?.minimize()}
        />
        <button 
          className="window-control-button window-control-maximize titlebar-no-drag"
          onClick={() => window.electron?.maximize()}
        />
        <button 
          className="window-control-button window-control-close titlebar-no-drag"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};
