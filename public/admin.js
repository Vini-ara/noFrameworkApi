const fileInput = document.getElementById('file-upload')
const textInput = document.getElementById('bird-name')
const textInputContainer = document.getElementById('name-input')
const fileInputContainer = document.getElementById('file-upload-container')
const imgContainer = document.createElement('span')
const uploadPreviewImg = document.createElement('img')
const suggestionListContainer = document.getElementById('suggestion')

const { birds } = await fetch('brazilBirds.json').then(response => response.json())

let matches = []

document.addEventListener('click', e => {
  let clickXstart = e.target.getBoundingClientRect().x;
  let clickXend = e.target.getBoundingClientRect().x + e.target.getBoundingClientRect().width;
  let clickYstart = e.target.getBoundingClientRect().y;
  let clickYend = e.target.getBoundingClientRect().y + e.target.getBoundingClientRect().height;

  let safeZoneXstart = suggestionListContainer.getBoundingClientRect().x;
  let safeZoneXend = suggestionListContainer.getBoundingClientRect().x + suggestionListContainer.getBoundingClientRect().width;
  let safeZoneYstart = textInput.getBoundingClientRect().y;
  let safeZoneYend = suggestionListContainer.getBoundingClientRect().y + suggestionListContainer.getBoundingClientRect().height;

  if(!(clickXstart >= safeZoneXstart && clickXend <= safeZoneXend && clickYstart >= safeZoneYstart && clickYend <= safeZoneYend)) {
    suggestionListContainer.classList.remove('active')
  }
})

textInput.addEventListener('focusin', () => {
  if(matches.length > 0) suggestionListContainer.classList.add('active')
})

suggestionListContainer.addEventListener('click', e => {
  if(e.path[0].nodeName.toLowerCase() === 'i') {
    textInput.value = e.path[1].innerText.split('\n')[0];
  } else {
    textInput.value = e.target.innerText.split('\n')[0];
  }

  suggestionListContainer.classList.remove('active')
})

textInput.addEventListener('input', e => {
  matches = []

  if(e.target.value.length < 2) {
    suggestionListContainer.classList.remove('active')
    return
  }

  birds.forEach(bird => {
    if(bird.common.includes(e.target.value) && matches.length < 10)
      matches.push(bird)
  })

  populateSuggestion(matches)

  if(matches.length > 0) 
    suggestionListContainer.classList.add('active')
  else 
    suggestionListContainer.classList.remove('active')
})

function populateSuggestion(matches) {
  while(suggestionListContainer.firstChild) {
    suggestionListContainer.removeChild(suggestionListContainer.firstChild)
  }

  matches.forEach(bird => {
    let suggestion = document.createElement('p')
    suggestion.innerText = bird.common 

    let sciName = document.createElement('i')
    sciName.innerText = bird.scientific

    suggestion.appendChild(document.createElement('br'))
    suggestion.appendChild(sciName)

    suggestionListContainer.appendChild(suggestion)
  })
}

fileInput.addEventListener('input', function(e) {
  if(e.target.files.length > 0) {
    var reader = new FileReader();

    reader.onload = function(a) {
      uploadPreviewImg.src = a.target.result
    }

    reader.readAsDataURL(e.target.files[0]);

    uploadPreviewImg.setAttribute('alt', "image preview");
    uploadPreviewImg.classList.add("img-input-preview")

    imgContainer.append(uploadPreviewImg)

    fileInputContainer.appendChild(imgContainer);
  }
})

imgContainer.addEventListener('click', function() {
  if(fileInput.files.length > 0) {
    fileInput.value = ""

    let child = imgContainer.firstElementChild;

    imgContainer.removeChild(child)
    fileInputContainer.removeChild(imgContainer)
  }
})