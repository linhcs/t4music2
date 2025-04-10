CREATE TRIGGER notify_followers_new_song
AFTER INSERT ON songs
FOR EACH ROW
BEGIN
    -- Get the artist's username
    DECLARE artist_username VARCHAR(100);
    SELECT username INTO artist_username
    FROM users
    WHERE user_id = NEW.user_id;

    -- Insert notifications for all followers
    INSERT INTO notifications (user_id, message)
    SELECT f.user_id_a, CONCAT(artist_username, ' just released a new song: ', NEW.title)
    FROM follows f
    WHERE f.user_id_b = NEW.user_id;
END; 