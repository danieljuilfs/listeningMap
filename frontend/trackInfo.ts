import type { ListeningMap } from "./annotations.js";
import { getAnnotations, getNotes} from "./annotations.js"; 
import { formatTime } from "./utils.js"; 
import { getCurrentTime, getDuration, getQueue } from "./musicService.js"; 
import { updateBar } from "./slider.js"

let counter: number = 0; 

//get the notes
let notes:  { note: string; lyrics: string; time: number }[] ; 

let nextTime: number; 

//updates the track name, duration time, composer. 
export function updateTrack(): void {

  const annotations: ListeningMap = getAnnotations(); 

  notes = getNotes(); 

  nextTime = notes[counter+1]?.time!;
  console.log("nextTime start: " + nextTime); 
  //get the div element that stores the track information. 
  const trackname: HTMLLinkElement = document.getElementById("trackName") as HTMLLinkElement;

  //get the composer div so we can set the composer
  const header: HTMLHeadingElement= document.getElementById("composer") as HTMLHeadingElement; 

  const album: HTMLLinkElement = document.getElementById("album") as HTMLLinkElement
 
  //set the track name
  trackname.textContent = annotations.title;  
  trackname.href = annotations.uri; 

  //get the composer from the attributes section. 
  const composer: string = annotations.composer; 

  //if there is a composer set the composer in the heading
  if (composer) header.textContent = composer; 

  //get the duration object from the DOM
  const duration: HTMLDivElement = document.getElementById("duration") as HTMLDivElement; 

  //get the duration from the queued object, which is in millseconds. convert to seconds. 
  const time: number = annotations.duration; 

  //set the duration for the track. 
  duration.textContent = formatTime(time); 
}

export function updateProgress(): void {

  //get the element time is stored in
  let time = document.getElementById("pbTime") as HTMLDivElement;

  const curTime = getCurrentTime(); 
  
  //update its text. 
  time.textContent = formatTime(curTime); 

  //calculate how far the bar should be moved
  const percent: number = (curTime / getDuration()) * 100; 

  //update the bar state
  updateBar(percent)

  const noteDiv: HTMLDivElement = document.getElementById("notes") as HTMLDivElement; 

 //the breakpoint has been passed, check 
 if (curTime > nextTime ) {

    counter++; 

    const nextNotes: number = notes[counter+1]?.time!
    if (nextNotes) nextTime = nextNotes;

    //need to handle playback state updates where someone jumps ahead in the bar. 
    while (curTime > nextTime) {
      counter++; 
      nextTime = notes[counter]?.time!; 
    }

    noteDiv.textContent = notes[counter]?.note!;
 }
  //need to handle playbackstates where someone jumps backwards in the bar. 
  else if (counter > 0 && curTime < notes[counter]?.time!) {
    //decrement the counter and update the next note
    counter--;
    nextTime = notes[counter+1]?.time!;

    //if the curTime lower than the time on current notes, we need to decrement until its not
    while (curTime < notes[counter]?.time!) {
      
        counter--;
        nextTime = notes[counter+1]?.time!;
    }

    noteDiv.textContent = notes[counter]?.note!;
    }

  
  }
