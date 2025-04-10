-- Backup of notifications table
CREATE TABLE IF NOT EXISTS notifications_backup LIKE notifications;
INSERT INTO notifications_backup SELECT * FROM notifications; 