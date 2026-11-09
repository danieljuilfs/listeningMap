import { seekToTime } from "./musicService.js";

export interface ListeningMap {
  title: string; 
  composer: string; 
  album: string; 
  performer: string;
  trackid: number; 
  uri: string; 
  duration: number; 
  sections: section[];
  comments: comment[];
  keys: key[];
  listenerType: string; 

}

export interface comment {
  commentnumber: number,
  starttime: number, 
  lyrics?: string,
  translation?: string,
  notes?: string
}

export interface key {
  keynumber: number,
  starttime: number,
  keytext: string
}

export interface section {
  sectionnumber: number,
  measure: string,  
  sectionname: string;
  starttime: number; 
  endtime: number; 
  lyrics?: string; 
  translation?:  string; 
  notes?: string; 
}


let annotations: ListeningMap; 

//holds the notes for the sections
const notes: { text: string; time: number }[] = [];


export function createAnnotations(request: ListeningMap) {

  annotations = request; 

  console.log("Annotations: ", annotations); 

  //holds the column titles for the sections
  const columns: string[] = []; 

  //get the div element that stores the track information. 
  const sectionDiv: HTMLDivElement = document.getElementById("sections") as HTMLDivElement;

  for (const curSection of annotations.sections ) {
    //create the parent div, append it to the dom
    let parentDiv: HTMLDivElement = document.createElement("div");
    parentDiv.classList.add("section"); 
    sectionDiv.append(parentDiv)

    //create the measure div, set its text, append it to the parent
    let measureDiv: HTMLDivElement = document.createElement("div"); 
    measureDiv.textContent = curSection.measure; 
    console.log("measure:" + curSection.measure); 
    measureDiv.classList.add("measure"); 
    parentDiv.append(measureDiv);

    //create the childDiv, set its text, append it to the parent
    let textDiv: HTMLDivElement = document.createElement("div"); 
    textDiv.textContent = curSection.sectionname; 
    textDiv.classList.add("sectionText"); 
    parentDiv.append(textDiv)

    //store the start time for the section in its data set so we can reference it on click
    parentDiv.dataset.time = String(curSection.starttime); 
    
    parentDiv.addEventListener("click", () => {
      //seek on clicking the div
      seekToTime(Number(parentDiv.dataset.time))

      //adding a timer for a short animation to show that the seeking worked
      parentDiv.classList.add("seek-success");
    });

    parentDiv.addEventListener("animationend", () => {
      parentDiv.classList.remove("seek-success");
    });

    //calculate how long each section is, and then add it to the array for doing output. 
    const duration: number = curSection.endtime - curSection.starttime;
    columns.push(`${duration}fr`); 

    //if the note isn't null, push it to the array, otherwise push an empty string. 
    notes.push({
        text: curSection.notes ?? "",
        time: curSection.endtime
    });
  }

  //set the width based on the size of each container
  sectionDiv.style.gridTemplateColumns = columns.join(" "); 

  //set the starting text for note div. 
  const noteDiv: HTMLDivElement = document.getElementById("notes") as HTMLDivElement; 

  noteDiv.textContent = notes[0]?.text!;



  //get the key bar
  const keyBar: HTMLDivElement = document.getElementById("keyBar") as HTMLDivElement; 

  //iterate over the keys, getting each and putting them in a div. 
  for (const curKey of request.keys) {
      const keyDiv: HTMLDivElement = document.createElement("div");

      keyDiv.classList.add("key");
      keyDiv.textContent = curKey.keytext;

      const position = (curKey.starttime / request.duration) * 100;

      keyDiv.style.left = `${position}%`;

      keyBar.append(keyDiv);
}

 }

export function getAnnotations(): ListeningMap {
  return annotations; 
}

export function getNotes() :  { text: string; time: number }[] {
  return notes; 
}

