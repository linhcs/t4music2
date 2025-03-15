import * as React from "react"

const Gallery = () => {
    // using placeholder images to create gallery
    
    const images = [
        // static example, change later to fetch images from database
        {id: 1, src: "/song-placeholder.jpg"},
        {id: 2, src: "/song-placeholder.jpg"},
        {id: 3, src: "/song-placeholder.jpg"},
        {id: 4, src: "/song-placeholder.jpg"},
        {id: 5, src: "/song-placeholder.jpg"},
        {id: 6, src: "/song-placeholder.jpg"},
        {id: 7, src: "/song-placeholder.jpg"},
        {id: 8, src: "/song-placeholder.jpg"},
        {id: 9, src: "/song-placeholder.jpg"},
        {id: 10, src: "/song-placeholder.jpg"},
        {id: 11, src: "/song-placeholder.jpg"},
        {id: 12, src: "/song-placeholder.jpg"},
        {id: 13, src: "/song-placeholder.jpg"},
        {id: 14, src: "/song-placeholder.jpg"},
        {id: 15, src: "/song-placeholder.jpg"},
        {id: 16, src: "/song-placeholder.jpg"},
        {id: 17, src: "/song-placeholder.jpg"},
        {id: 18, src: "/song-placeholder.jpg"},
        {id: 19, src: "/song-placeholder.jpg"},
        {id: 20, src: "/song-placeholder.jpg"},
        {id: 21, src: "/song-placeholder.jpg"},
        {id: 22, src: "/song-placeholder.jpg"},
        {id: 23, src: "/song-placeholder.jpg"},
        {id: 24, src: "/song-placeholder.jpg"},

    ];

    return(
        // adding same background styling as login and sign up page
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Song Gallery
          </h1>
        
        {/* can use in-line styling or cva (class-variance authoritity) to optimize repitition */}
        {/*grid with 3 columns, spacing of 12px, padding of 12px (each increment of 1 increases by 4px)*/} 
        <div className= "grid grid-cols-6 gap-3 p-3">
            {images.map((image) => (
                <div key = {image.id} className="flex justify-center">
                    <img src = {image.src} className="w-full h-auto rounded-lg shadow-lg"/>
                </div>
            ))}
        </div>

        </div>

        
    );
};

export default Gallery;