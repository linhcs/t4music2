-- Drop trigger if it exists
DROP TRIGGER IF EXISTS `after_song_insert`;

-- Create trigger for new song notifications
CREATE TRIGGER after_song_insert
AFTER INSERT ON songs
FOR EACH ROW
INSERT INTO notifications (user_id, message, created_at, is_read)
SELECT f.user_id_b, 
       CONCAT('New song uploaded by ', u.username, ': ', NEW.title),
       NOW(),
       0
FROM follows f
JOIN users u ON u.user_id = NEW.user_id
WHERE f.user_id_a = NEW.user_id; 