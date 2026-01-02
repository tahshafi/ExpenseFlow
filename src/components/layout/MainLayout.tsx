import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Notifications } from './Notifications';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen flex flex-col">
        <div className="h-16 border-b border-border flex items-center justify-end px-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <Notifications />
        </div>
        <div className="p-4 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
