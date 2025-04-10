export enum UsersRole {
  LISTENER = "listener",
  ARTIST = "artist",
  ADMIN = "admin",
}

export interface User {
  user_id: number;
  username: string;
  pfp?: string;
  email: string;
  password_hash: string;
  role: UsersRole;
  created_at?: Date;
  updated_at?: Date;
}

export interface Album {
  album_id: number;
  album_art?: string;
  title: string;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Song {
  song_id: number;
  title: string;
  Album_id?: number;
  genre?: string;
  duration: number;
  file_path: string;
  file_format: string;
  uploaded_at?: Date;
  plays_count?: number;
  user_id: number;
  URL?: string;
  album?: Album;
  users?:{
    username: string;
  };
}

export interface Playlist {
  playlist_id: number | "liked"; 
  name: string;
  playlist_art?: string;
  user_id?: number; 
  isLiked?: boolean;
  songs?: Song[]; 
}


export interface LibraryItem {
  library_id: number;
  user_id: number;
  item_id: number;
  item_type: "song" | "album" | "playlist";
  created_id: number;
  updated_at?: Date;
}

export interface Like {
  like_id: number;
  listener_id: number;
  song_id: number;
  liked_at?: Date;
}

export interface Follow {
  follow_id: number;
  user_id_a: number;
  user_id_b: number;
  follow_at?: Date;
}

export interface StreamingHistory {
  stream_id: number;
  listener_id: number;
  user_id: number;
  song_id: number;
  played_at?: Date;
}
