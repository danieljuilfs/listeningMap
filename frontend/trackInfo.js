import { getAnnotations, getNotes } from "./annotations.js";
import { formatTime } from "./utils.js";
import { getCurrentTime, getDuration, getQueue } from "./musicService.js";
import { updateBar } from "./slider.js";
let counter = 0;
//get the notes
let notes;
let nextTime;
//updates the track name, duration time, composer. 
export function updateTrack() {
    const annotations = getAnnotations();
    notes = getNotes();
    nextTime = notes[counter]?.time;
    //get the div element that stores the track information. 
    const trackname = document.getElementById("trackName");
    //get the composer div so we can set the composer
    const header = document.getElementById("composer");
    const album = document.getElementById("album");
    //set the track name
    trackname.textContent = annotations.title;
    //set the album name
    album.textContent = "Album: " + annotations.album;
    album.href = annotations.uri;
    //get the composer from the attributes section. 
    const composer = annotations.composer;
    //if there is a composer set the composer in the heading
    if (composer)
        header.textContent = composer;
    //get the duration object from the DOM
    const duration = document.getElementById("duration");
    //get the duration from the queued object, which is in millseconds. convert to seconds. 
    const time = annotations.duration;
    //set the duration for the track. 
    duration.textContent = formatTime(time);
}
export function updateProgress() {
    //get the element time is stored in
    let time = document.getElementById("pbTime");
    const curTime = getCurrentTime();
    //update its text. 
    time.textContent = formatTime(curTime);
    //calculate how far the bar should be moved
    const percent = (curTime / getDuration()) * 100;
    //update the bar state
    updateBar(percent);
    const noteDiv = document.getElementById("notes");
    //the breakpoint has been passed, check 
    if (curTime > nextTime) {
        counter++;
        nextTime = notes[counter]?.time;
        //need to handle playback state updates where someone jumps ahead in the bar. 
        while (curTime > nextTime) {
            counter++;
            nextTime = notes[counter]?.time;
        }
        noteDiv.textContent = notes[counter]?.text;
    }
    //need to handle playbackstates where someone jumps backwards in the bar. 
    else if (counter > 0 && curTime < notes[counter - 1]?.time) {
        counter--;
        nextTime = notes[counter]?.time;
        while (curTime < notes[counter - 1]?.time) {
            counter--;
            nextTime = notes[counter]?.time;
        }
        noteDiv.textContent = notes[counter]?.text;
    }
}
//# sourceMappingURL=trackInfo.js.map