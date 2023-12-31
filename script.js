// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.mediaDevices.getUserMedia);

// set up basic variables for app
var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');

// disable stop button while not recording
stop.disabled = true;

// visualizer setup - create web audio api context and canvas
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

// main block for doing the audio recording
if (navigator.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');
      console.log(clipName);
      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if (clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        var existingName = clipLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occurred: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints)
    .then(onSuccess)
    .catch(onError);
} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  WIDTH = canvas.width
  HEIGHT = canvas.height;

  draw();

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

// js for yewtere pular


 $(function(){
        
        function setHeight(){
            $(".response").each(function(index,element){
                var target = $(element);
                target.removeClass("fixed-height");
                var height = target.innerHeight();
                target.attr("data-height", height)
                      .addClass("fixed-height");
            });
        };
        
        $("input[name=question]").on("change", function(){
            $("p.response").removeAttr("style");
            
            var target = $(this).next().next();
            target.height(target.attr("data-height"));
        })
        
        setHeight();
    });


   // Function to switch the language and update the content
function switchLanguage(language) {
  // Update the content based on the selected language
  if (language === 'fr') {
    document.documentElement.lang = 'fr';
    document.title = 'Neene Maatara (French)';
    // Update other French content here
  } else {
    document.documentElement.lang = 'en';
    document.title = 'Neene Maatara';
    // Update other English content here
  }

  // Remove the 'active' class from all language links
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.classList.remove('active');
  });

  // Add the 'active' class to the clicked language link
  const activeLink = document.querySelector(`[data-language="${language}"]`);
  activeLink.classList.add('active');
}

// Function to add click event listeners to language links
function addLanguageLinkListeners() {
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const language = link.getAttribute('data-language');
      switchLanguage(language);
    });
  });
}

// Call the function to add click event listeners to language links when the page is loaded
window.addEventListener('load', () => {
  addLanguageLinkListeners();
});


// deena script starts

const imageWrapper = document.querySelector('.image-wrapper');
const audio = document.getElementById('bottom-audio');

imageWrapper.addEventListener('mouseenter', () => {
  audio.play();
});

imageWrapper.addEventListener('mouseleave', () => {
  audio.pause();
  audio.currentTime = 0;
});
