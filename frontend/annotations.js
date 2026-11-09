import { seekToTime } from "./musicService.js";
let annotations;
//holds the notes for the sections
const notes = [];
export function createAnnotations(request) {
    annotations = request;
    console.log("Annotations: ", annotations);
    //holds the column titles for the sections
    const columns = [];
    //get the div element that stores the track information. 
    const sectionDiv = document.getElementById("sections");
    for (const curSection of annotations.sections) {
        //create the parent div, append it to the dom
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("section");
        sectionDiv.append(parentDiv);
        //create the measure div, set its text, append it to the parent
        let measureDiv = document.createElement("div");
        measureDiv.textContent = curSection.measure;
        console.log("measure:" + curSection.measure);
        measureDiv.classList.add("measure");
        parentDiv.append(measureDiv);
        //create the childDiv, set its text, append it to the parent
        let textDiv = document.createElement("div");
        textDiv.textContent = curSection.sectionname;
        textDiv.classList.add("sectionText");
        parentDiv.append(textDiv);
        //store the start time for the section in its data set so we can reference it on click
        parentDiv.dataset.time = String(curSection.starttime);
        parentDiv.addEventListener("click", () => {
            //seek on clicking the div
            seekToTime(Number(parentDiv.dataset.time));
            //adding a timer for a short animation to show that the seeking worked
            parentDiv.classList.add("seek-success");
        });
        parentDiv.addEventListener("animationend", () => {
            parentDiv.classList.remove("seek-success");
        });
        //calculate how long each section is, and then add it to the array for doing output. 
        const duration = curSection.endtime - curSection.starttime;
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
    const noteDiv = document.getElementById("notes");
    noteDiv.textContent = notes[0]?.text;
    //get the key bar
    const keyBar = document.getElementById("keyBar");
    //iterate over the keys, getting each and putting them in a div. 
    for (const curKey of request.keys) {
        const keyDiv = document.createElement("div");
        keyDiv.classList.add("key");
        keyDiv.textContent = curKey.keytext;
        const position = (curKey.starttime / request.duration) * 100;
        keyDiv.style.left = `${position}%`;
        keyBar.append(keyDiv);
    }
}
export function getAnnotations() {
    return annotations;
}
export function getNotes() {
    return notes;
}
//# sourceMappingURL=annotations.js.map