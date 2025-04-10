-- Drop existing notifications table
DROP TABLE IF EXISTS notifications;

-- Recreate notifications table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    INDEX (user_id)
);

-- Create trigger for new songs
CREATE TRIGGER after_song_insert
AFTER INSERT ON songs
FOR EACH ROW
BEGIN
    INSERT INTO notifications (user_id, message, created_at, is_read)
    SELECT 
        f.user_id_b,
        CONCAT('New song uploaded by ', u.username, ': ', NEW.title),
        NOW(),
        FALSE
    FROM follows f
    JOIN users u ON u.user_id = NEW.user_id
    WHERE f.user_id_a = NEW.user_id;
END;

-- Restore data from backup
INSERT INTO notifications SELECT * FROM notifications_backup; 