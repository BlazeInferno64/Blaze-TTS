const voiceList = document.querySelector(".voice-name");
const textInput = document.querySelector(".text-input");
const speedInput = document.querySelector(".speed-input");
const pauseBtn = document.querySelector(".pause");
const stopBtn = document.querySelector(".stop");
const convertBtn = document.querySelector(".convert");

const selectFileBtn = document.querySelector(".file");
const closeBtn = document.querySelector(".close");
const selectBtn = document.querySelector(".choose");
const bg = document.querySelector(".bg");
const bgCard = document.querySelector(".bg-card");


const readFile = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.addEventListener("load",(e) => {
        textInput.value = fileReader.result;
    })
    fileReader.addEventListener("error",(e) => {
        alert(`An error occurred!`);
    })
}

selectFileBtn.onchange = (e) => {
    const file = e.target.files[0];
    if(!file){
        return;
    }
    readFile(file);
    closeCard();
    convertBtn.classList.remove("none");
}

const openCard = () => {
    bg.classList.remove("hide");
    bgCard.classList.add("ani");
    bgCard.classList.remove("hide");

    setTimeout(() => {
        bgCard.classList.remove("down");
    }, 500);
}

const closeCard = () => {
    bgCard.classList.add("up");
    bgCard.classList.add("anti");
    setTimeout(() => {
        bgCard.classList.add("hide");
    }, 700);
    setTimeout(() => {
        bg.classList.add("hide");
        bgCard.classList.remove("anti");
        bgCard.classList.add("hide");
    }, 1000);

    setTimeout(() => {
        bgCard.classList.add("down");
        bgCard.classList.remove("up");
        bgCard.classList.remove("ani");
    }, 1200);
}

openCard();

let synth = speechSynthesis;
let isSpeaking = true;

voices();

function voices(e){
    for( let voice of synth.getVoices()) {
        let selected = voice.name === 'Google US English' ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name}(${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

synth.addEventListener("voiceschanged", voices);


function textToSpeech(text){
    try {
        if(synth.paused && synth.speaking){
            convertBtn.innerText = "Playing...";
            stopBtn.classList.remove("none");
            convertBtn.classList.add("none");
            synth.resume();
            return;
        }
        if(speedInput.value > 5){
            const notify_title = `Invalid Input ${speedInput.value}!`;
            const notify_body = `TypeError: Cannot exceed speed limit more than 5x!`;
            const click_msg = `Sucessfully alerted user!`;
            new window.Notification(notify_title, 
                {
                    timestamp: Date(),
                    body: notify_body,
                    icon: "./assets/img/logo.ico",
                    tag: "Blaze TTS",
                    badge: "./assets/img/logo.ico"
                }).onclick = () => {
                    console.log(click_msg);
                }
        }
        else{
            let utterance = new SpeechSynthesisUtterance(text);
            for(let voice of synth.getVoices()){
                if(voice.name === voiceList.value){
                    utterance.rate = speedInput.value || 1;
                    utterance.voice = voice;
                }
            }
            utterance.addEventListener("start",(e) => {
                textInput.disabled = true;
                console.log("Starting...");
                convertBtn.classList.add("none");
                convertBtn.innerText = `Playing...`;
                stopBtn.classList.remove("none");
                pauseBtn.classList.remove("none");
            })
            utterance.addEventListener("end",(e) => {
                pauseBtn.classList.add("none");
                stopBtn.classList.add("none");
                convertBtn.classList.remove("none");
                textInput.disabled = false;
                textInput.focus();
                console.log("Done!");
                convertBtn.innerText = `Convert to Speech`
            })
            utterance.addEventListener("error",(e) => {
                console.error(`${e.error}`);
                textInput.disabled = false;
                convertBtn.classList.remove("none");
                convertBtn.innerText = `Convert to Speech`
            })
            synth.speak(utterance);
        }

    } catch (err) {
        alert(err);
        console.error(err);
    }
}

function pauseText(){
    if(!synth.speaking && !isSpeaking){
        return isSpeaking = false;
    }
    else{
        synth.pause();
        isSpeaking = true;
        convertBtn.classList.remove("none");
        stopBtn.classList.add("none");
        convertBtn.innerText = "Continue playing...";
    }
}


function stopText(){
    textInput.disabled == false;
    synth.resume();
    synth.cancel();
    stopBtn.classList.add("none");
    pauseBtn.classList.add("none");
}

textInput.addEventListener("input",(e) => {
    if(textInput.value.length > 0 && speedInput.value.length > 0){
        convertBtn.classList.remove("none");
    }
    else{
        convertBtn.classList.add("none");
    }
})

speedInput.addEventListener("input",(e) => {
    if(speedInput.value.length > 0 && textInput.value.length > 0){
        convertBtn.classList.remove("none");
    }
    else{
        convertBtn.classList.add("none");
    }
})

convertBtn.addEventListener("click",(e) => {
    textToSpeech(textInput.value);
})

pauseBtn.addEventListener("click",(e) => {
    pauseText();
})

stopBtn.addEventListener("click",(e) => {
    stopText();
})

closeBtn.addEventListener("click",(e) => {
    closeCard();
})

selectBtn.addEventListener("click",(e) => {
    selectFileBtn.click();
})

window.addEventListener("dragover",(e) => {
    e.preventDefault();
})

window.addEventListener("drop",(e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if(droppedFile.type == "text/plain"){
        readFile(droppedFile);
        convertBtn.classList.remove("none");
    }
    else{
        const notify_title = `Invalid file-type ${droppedFile.type}!`;
        const notify_body = `TypeError: Dropped file is not a .txt file!`;
        const click_msg = `Sucessfully alerted user!`;
        new window.Notification(notify_title, 
            {
                timestamp: Date(),
                body: notify_body,
                icon: "./assets/img/logo.ico",
                tag: "Blaze TTS",
                badge: "./assets/img/logo.ico"
            }).onclick = () => {
                console.log(click_msg);
            }
    }
})