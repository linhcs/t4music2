-- Drop existing trigger
DROP TRIGGER IF EXISTS `notify_new_song`;

-- Create new trigger with correct logic
CREATE TRIGGER notify_new_song
AFTER INSERT ON songs
FOR EACH ROW
INSERT INTO notifications (user_id, message, created_at, is_read)
SELECT f.user_id_a,
       CONCAT('Great news! New song "', NEW.title, '" was just uploaded by an artist you follow!'),
       NOW(),
       0
FROM follows f
WHERE f.user_id_b = NEW.user_id; -- user_id_b is the artist 