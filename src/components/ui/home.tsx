"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar"; // also made a sidebar!!
import { useState, useEffect, useCallback } from "react";
import { Song } from "../../../types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore"; // importing storage from zustand
import PlayBar from "@/components/ui/playBar";

const ListenerHome = () => {
  const { username } = useUserStore(); // we get username from zustand
  const [songs, setSongs] = useState<Song[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); //stores the song instance (actual audio file)
  const [currentSong, setCurrentSong] = useState<Song | null>(null); //stores information to keep track of the song (title)
  const [isPlaying, setIsPlaying] = useState<boolean>(false); //flag to set true/false if playing, false by default
  const [progress, setProgress] = useState(0);

    //fetch songs/albums from API
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('/api/songs');
                const data: Song[] = await response.json();
                setSongs(data);
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
            return audio.paused ? audio.play() : audio.pause();
        }
        else{
            //if a different song is clicked on (so there is audio it's just not the same one as before)
            if (audio){
                //pause the current audio
                audio.pause();
                audio.removeEventListener('timeupdate', updateProgress);
            }
            //create a new audio object
            const newAudio = new Audio(song.file_path);
            newAudio.addEventListener('timeupdate', updateProgress);
            return newAudio.play()
            .then(() => {
              setAudio(newAudio);
              setCurrentSong(song);
              setIsPlaying(true);
              setProgress(0);
            })
            .catch(error => {
              console.error("Playback failed:", error);
            }); 
        }
    };
  
  //update progress bar
  const updateProgress = useCallback(() => {
    if (audio && !isNaN(audio.duration)){
      const newProgress = (audio.currentTime/audio.duration) * 100;
      setProgress(newProgress);
    }
  }, [audio]);

  //ensure playbar works
  useEffect(() => {
    if (!audio) return;
    const options: AddEventListenerOptions = {passive: true};
    audio.addEventListener('timeupdate', updateProgress, options);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress, options);
    };

  }, [audio, updateProgress]);

  //allow the user to adjust the time in the song by clicking on progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !currentSong) return; //if no song is playing

    const ProgressBar = e.currentTarget;
    const clickPosition = e.clientX -ProgressBar.getBoundingClientRect().left;
    const progressBarWidth = ProgressBar.clientWidth;
    const seekPercentage = (clickPosition/progressBarWidth) * 100;
    const seekTime = (audio.duration * seekPercentage) / 100;

    audio.currentTime = seekTime;
    setProgress(seekPercentage);
  };

  const SongGallerySection = ({ title, items }: { title: string; items: Song[] }) => (
    <section className="w-full max-w-7xl">
      <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items.map((song) => {
          const album_art = song.album?.album_art || '';

          return (
            <div
              key={song.song_id}
              className="group relative rounded-lg overflow-hidden shadow-md no-flicker"
              style={{
                backgroundImage: `url(${album_art})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "60%",
                paddingTop: "60%",
                willChange: "transform, opacity"
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear flex items-center justify-center">
                <button 
                  onClick= {(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  audioPlayer(song);
                }} className="text-5xl text-white transition-transform duration-75 hover:scale-105 ease-out">
                  {currentSong?.song_id === song.song_id && isPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
                  
                </button>
              </div>
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
                <h3 className="text-white text-sm font-semibold truncate">{song.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} /> 

      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />
        <main className="p-6 overflow-auto">
          <SongGallerySection title="Continue Where You Left Off" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recently Played Songs" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recently Played Albums" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recommended For You" items={songs.slice(0, 5)} />
        </main>
      </div>
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause = {() => currentSong && audioPlayer(currentSong)}
        onSeek={handleSeek}
        />
    </div>
  );
};

export default ListenerHome;
