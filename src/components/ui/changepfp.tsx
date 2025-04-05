"use client";

import { FaPlusCircle } from "react-icons/fa";
import { useRef, useState } from "react";

export default function changeProfilePic () {
    //would probably move the entire user profile picture to here to keep picture + button in a container
    const fileInput = useRef<HTMLInputElement>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const onButtonClick = () => {
        //triggers file upload
        fileInput.current?.click();
    }

    //creates button on the bottom right of user profile picture to change profile picture
    <div className = "container"> 
        {/*contain pfp and button in same box*/}
        <button className = "absolute " >
            <FaPlusCircle/>
        </button>
    </div>

}