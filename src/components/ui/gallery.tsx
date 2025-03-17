"use client";
import{useState, useRef} from "react";
import { Song, Album } from "../../../types"; //imports song interface ("structure") to use in gallery

const Gallery = () => {
    //declare album to assign to songs

    const[albums, setAlbums] = useState<Album[]>([
        {
            Album_id: 1,
            album_art: '../../../public/song-placeholder.jpg',
            title: 'Global Warming',
            user_id: 1,
            created_at: new Date(),
            updated_at: new Date()
        },
    ]);
    
    const [songs, setSongs] = useState<Song[]>([
        //assigning placeholder values to each song
        {
            song_id: 1,
            title: 'Hotel Room Service',
            Album_id: 1,
            genre: 'Pop',
            duration: 180,
            file_path: '../../music/HotelRoomService.mp3',
            file_format: 'mp3',
            uploaded_at: new Date(),
            plays_count: 1,
            user_id: 1,
        },

        {
            song_id: 2,
            title: 'Hotel Room Service',
            Album_id: 1,
            genre: 'Pop',
            duration: 180,
            file_path: '../../music/HotelRoomService.mp3',
            file_format: 'mp3',
            uploaded_at: new Date(),
            plays_count: 1,
            user_id: 1,
        },
        
        {
            song_id: 3,
            title: 'Hotel Room Service',
            Album_id: 1,
            genre: 'Pop',
            duration: 180,
            file_path: '../../music/HotelRoomService.mp3',
            file_format: 'mp3',
            uploaded_at: new Date(),
            plays_count: 1,
            user_id: 1,
        },

        {
            song_id: 4,
            title: 'Hotel Room Service',
            Album_id: 1,
            genre: 'Pop',
            duration: 180,
            file_path: '../../music/HotelRoomService.mp3',
            file_format: 'mp3',
            uploaded_at: new Date(),
            plays_count: 1,
            user_id: 1,
        },

        {
            song_id: 5,
            title: 'Hotel Room Service',
            Album_id: 1,
            genre: 'Pop',
            duration: 180,
            file_path: '../../music/HotelRoomService.mp3',
            file_format: 'mp3',
            uploaded_at: new Date(),
            plays_count: 1,
            user_id: 1,
        },

    ]);

    //function to play song
    const playSong = (file_path : string) => {
        const audio = new Audio(file_path);
        audio.play();
    }

    return(
        // adding same background styling as login and sign up page
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Song Gallery
          </h1>
        
        {/* can use in-line styling or cva (class-variance authoritity) to optimize repitition */}
        {/*grid with 6 columns, spacing of 12px, padding of 12px (each increment of 1 increases by 4px)*/} 
        <div className= "grid grid-cols-6 gap-3 p-3">
            {songs.map((song) => {
                //find album referenced by song to return album cover art
                const album = albums.find((album) => album.Album_id === song.Album_id);
                const album_art = album?.album_art || '';

                return (
                    <div 
                    key = {song.song_id} className="flex justify-center"
                    style = {{
                        backgroundImage: `url(${album_art})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '300px',
                        borderRadius: '10px',
                    }}>

                    <div className= "text-center">
                    <h3 className = "text-white p-1"> {song.title} </h3>
                    <button
                        onClick= {() => playSong(song.file_path)}
                        className = "bg-black-500 text-white px-5 rounded-mx mt-2">
                        Play ▶️
                    </button>
                    </div>
                </div>
                );
            })}
        </div>
    </div>
    );
};

export default Gallery;