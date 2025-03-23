"use client";
import{useState, useEffect} from "react";
import { Song, Album } from "../../../types"; //imports song interface ("structure") to use in gallery

const Gallery = () => {
    //declare album to assign to songs
    const [albums, setAlbums] = useState<Album[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    //stores the song instance (actual audio file)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    //stores information to keep track of the song (title)
    const [currentSong, setCurrentSong] = useState<Song | null>(null);

    //flag to set true/false if playing, false by default
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    //fetch songs/albums from API
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('/api/songs');
                const data: Song[] = await response.json();
                setSongs(data);

                //prevent duplicate album objects
                const albumList = data.reduce((acc: Album[], song: Song) => {
                    if (song.album && !acc.find(album => album.Album_id === song.album?.Album_id)){
                        acc.push(song.album);
                    }
                    return acc;
                }, [] as Album[]);
                setAlbums(albumList);
            } catch(error){
                console.error("Failed to fetch songs:", error);
            }
        };
        fetchData();
    }, []);

    //keeps track if audio play/pause
    useEffect(() => {
        if (audio) {
            //event listeners to keep track of when playing/pausing
            const onAudioPlay = () => setIsPlaying(true);
            const onAudioPause = () => setIsPlaying(false);

            audio.addEventListener("play", onAudioPlay);
            audio.addEventListener("pause", onAudioPause);

            //delete event listeners when audio changes
            return () => {
                audio.removeEventListener("play", onAudioPlay);
                audio.removeEventListener("pause", onAudioPause);
            };

        }

    }, [audio]);

    //function to play/pause song, takes a Song object as argument
    const audioPlayer = (song : Song) => {
        //check if audio exists and is currently playing
        if (audio && currentSong?.song_id === song.song_id){
            if (audio.paused){
                audio.play();
            }
            else{
                audio.pause();
            }
        }
        else{
            //if a different song is clicked on (so there is audio it's just not the same one as before)
            if (audio){
                //pause the current audio
                audio.pause();
            }
            //create a new audio object
            const newAudio = new Audio(song.file_path);
            newAudio.play();
            setAudio(newAudio);
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };



    return(
        // adding same background styling as login and sign up page
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Song Gallery
          </h1>
        
        {/* can use in-line styling or cva (class-variance authoritity) to optimize repitition */}
        {/*grid with 6 columns, spacing of 12px, padding of 12px (each increment of 1 increases by 4px)*/} 
        <div className= "grid grid-cols-5 gap-3 p-5 w-full max-w-7xl">
            {songs.map((song) => {
                //find album referenced by song to return album cover art
                const album_art = song.album?.album_art || '';

                return (
                    <div 
                    key = {song.song_id} className="flex flex-col justify-end"
                    style = {{
                        backgroundImage: `url(${album_art})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '300px',
                        width: '100%',
                    }}>

                    <div className= "bg-black bg-opacity-50 p-2 rounded-b-lg">
                    <h2 className = "text-white font-bold p-1"> {song.title} </h2>
                    <button
                        onClick= {() => audioPlayer(song)}
                        className = "bg-white font-medium text-black px-2 mt-2 hover:bg-gray-100">
                        {currentSong?.song_id === song.song_id && isPlaying ? '⏸️' : '▶️'}
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