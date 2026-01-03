import { useState, useEffect } from 'react';
import { Bell, Check, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notifications as notificationsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  _id?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationsApi.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 5 seconds for near real-time updates
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        (n.id === id || n._id === id) ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const displayedNotifications = notifications
    .filter(n => !n.isRead)
    .slice(0, 5);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Notifications</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => fetchNotifications()}
              title="Refresh notifications"
            >
              <RefreshCcw className="w-3 h-3" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-auto py-1">
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {displayedNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No new notifications
            </div>
          ) : (
            <div className="divide-y">
              {displayedNotifications.map((notification) => (
                <div 
                  key={notification.id || notification._id} 
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.isRead && "bg-primary/5"
                  )}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id || notification._id || '')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className={cn("text-sm font-medium", !notification.isRead && "text-primary")}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
