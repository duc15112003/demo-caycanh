import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">

      <div className="max-w-[1600px] mx-auto">
        {children}
      </div>
    </main>

  );
};

export default MainLayout;
