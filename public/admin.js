let birds = []

const Api = {
  post: async (body) => {
    const opt = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: body
    }
    await fetch('/api/images', opt);
  },
  get: async () => {
    const images = await fetch('/api/images')
    const data = await images.json();

    return data;
  },
  getBirds: async () => {
    let birdData = await fetch('brazilBirds.json').then(response => response.json()).then(res => (birds = res.birds));
  }
}

class BasicDomElemnts {
  constructor() {
    this.addPhotoSection =  document.getElementById("addPhoto");
    this.editPhotoSection = document.getElementById("editPhoto");
  }
}

class SectionNavigation extends BasicDomElemnts {
  constructor() {
    super()

    this.addButton = document.getElementById("insertSelector");
    this.editButton =  document.getElementById("editSelector");

    this.setHandlers()
  }

  setHandlers() {
    this.addButton?.addEventListener('click', function() {
      this.SelectAddSection()
    }.bind(this), false);
    this.editButton?.addEventListener('click', function() {
      this.SelectEditSection()
    }.bind(this), false);
  }

  SelectEditSection() {
    this.addButton?.classList.remove("active") 
    this.editButton?.classList.add("active")

    this.editPhotoSection?.classList.add("visible")
    this.addPhotoSection?.classList.remove("visible")
  }

  SelectAddSection() {
    this.addButton?.classList.add("active") 
    this.editButton?.classList.remove("active")

    this.editPhotoSection?.classList.remove("visible")
    this.addPhotoSection?.classList.add("visible")
  }
}

class EditSection {
  constructor(sectionNavigation) {
    this.sectionNavigation = sectionNavigation

    this.setHandlers();
  }

  setHandlers() {
    this.sectionNavigation.editButton.addEventListener('click', function() {
      this.MountEditSection()
    }.bind(this), false)
  }

  async MountEditSection() {     
    const images = await Api.get();

    images.forEach((post) => {
      this.CardCreation(post, this.sectionNavigation?.editPhotoSection);
    });
  }

  CardCreation(post, fatherElement) {
    const card = document.createElement('div')
    const img = document.createElement('img')

    img.src = post.image
    img.alt = post.commonName

    const info = document.createElement('div')

    const name = document.createElement('p')
    name.innerText = post.commonName

    const sciName = document.createElement('p')
    sciName.innerText = post.scientificName

    const actions = document.createElement('div')
    const editBtn = document.createElement('button') 
    const delBtn = document.createElement('button')

    card.classList.add('card')
    card.appendChild(img)
    card.appendChild(info)
    card.appendChild(actions)

    info.classList.add('cardInfo')
    info.appendChild(name)
    info.appendChild(sciName)

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)
    fatherElement.appendChild(card)
  }
}

class Form {
  constructor( addedPhotosBuffer) {
    this.suggestions = new FormSuggestions()
    this.addedPhotosBuffer = addedPhotosBuffer

    this.formElement = document.getElementById('photo-form') 
    this.photoInput = document.getElementById('file-upload')
    this.commonNameInput = document.getElementById('bird-name')
    this.scientificNameInput = document.getElementById('scientific-name')

    this.previewContainer = document.getElementById('file-upload-container')
    this.previewImg = document.createElement('img')
    this.previewImgWrapper = document.createElement('span')

    this.setHandlers()
  }

  setHandlers() {
    this.formElement.addEventListener('submit', function(e) {
      this.handleFormSubmission(e)
    }.bind(this), false)
    this.photoInput.addEventListener('input', function(e) {
      this.handlePhotoInput(e)
    }.bind(this), false)

    this.commonNameInput.addEventListener('focus', function() {
      this.handleCommonNameFocus()
    }.bind(this), false)
    this.commonNameInput.addEventListener('input', function(e) {
      this.handleCommonNameInput(e)
    }.bind(this), false)

    this.previewImgWrapper.addEventListener('click', function () {
      this.handleImgWrapperClick()
    }.bind(this), false)

    this.suggestions.suggestionsContainer.addEventListener('click', function (e) {
      this.handleSuggestionClick(e)
    }.bind(this), false)
    document.addEventListener('click', function (e) {
      this.handleSuggestionClose(e)
    }.bind(this), false)
  }

  handlePhotoInput(e) {
    if(e.target.files.length === 0) return;

    var reader = new FileReader();

    reader.onload = function(a) {
      this.previewImg.src = a.target.result
    }.bind(this)

    reader.readAsDataURL(e.target.files[0]);

    this.previewImg.setAttribute('alt', "image preview");
    this.previewImg.classList.add("img-input-preview")

    this.previewImgWrapper.append(this.previewImg)
    this.previewContainer.appendChild(this.previewImgWrapper);
  }
  
  handleCommonNameFocus() {
    if(this.suggestions?.matches.length > 0) this.suggestions?.suggestionsContainer.classList.add('active');
  } 

  handleCommonNameInput(e) {
    this.suggestions.matches = []

    if(e.target.value.length < 2) {
      this.suggestions.suggestionsContainer.classList.remove('active');
      this.suggestions.matches = []
      return;
    }

    birds.forEach(bird => {
      if(bird.common.includes(e.target.value) && this.suggestions.matches.length < 10)
        this.suggestions.addSuggestion(bird);
    });

    this.suggestions.populateSuggestion();

    if(this.suggestions.matches.length > 0) 
      this.suggestions.suggestionsContainer.classList.add('active');
    else 
      this.suggestions.suggestionsContainer.classList.remove('active');
  }
   
  handleImgWrapperClick() {
    this.photoInput.value = ""

    this.previewImgWrapper.removeChild(this.previewImg)
    this.previewContainer.removeChild(this.previewImgWrapper)
  }

  handleSuggestionClick(e) {
    if(e.target.nodeName.toLowerCase() === 'i') {
      this.scientificNameInput.value = e.target.innerText;
      this.commonNameInput.value = e.target.parentElement.innerText.split('\n')[0];
    } else {
      this.scientificNameInput.value = e.target.innerText.split('\n')[1];
      this.commonNameInput.value = e.target.innerText.split('\n')[0];
    }

    this.suggestions.suggestionsContainer.classList.remove('active')
  }

  handleSuggestionClose(e) {
    let clickXstart = e.target.getBoundingClientRect().x;
    let clickXend = e.target.getBoundingClientRect().x + e.target.getBoundingClientRect().width;
    let clickYstart = e.target.getBoundingClientRect().y;
    let clickYend = e.target.getBoundingClientRect().y + e.target.getBoundingClientRect().height;

    let safeZoneXstart = this.suggestions?.suggestionsContainer?.getBoundingClientRect().x;
    let safeZoneXend = this.suggestions?.suggestionsContainer?.getBoundingClientRect().x + this.suggestions?.suggestionsContainer?.getBoundingClientRect().width;
    let safeZoneYstart = this.commonNameInput?.getBoundingClientRect().y;
    let safeZoneYend = this.suggestions?.suggestionsContainer?.getBoundingClientRect().y + this.suggestions?.suggestionsContainer?.getBoundingClientRect().height;

    if(!(clickXstart >= safeZoneXstart && clickXend <= safeZoneXend && clickYstart >= safeZoneYstart && clickYend <= safeZoneYend)) {
      this.suggestions?.suggestionsContainer.classList.remove('active')
    }
  }

  handleFormSubmission(e) {
    e.preventDefault();
    
    let fields = {
      commonName: this.commonNameInput.value,
      scientificName: this.scientificNameInput.value,
      image: this.previewImg.src
    }

    this.addedPhotosBuffer.queue.push(fields)

    const addedImg = document.createElement('img')
    addedImg.src = fields.image;
    addedImg.alt = "image to be submitted"

    let addedImgWrapper = document.createElement('span');
    addedImgWrapper.classList.add('img-preview-wrapper');
    addedImgWrapper.classList.add(`${this.addedPhotosBuffer.queue.length - 1}`);
    addedImgWrapper.appendChild(addedImg);

    addedImgWrapper.addEventListener('click', function (e) {
      const listIdx = Number(e.target.classList[1]);

      if(listIdx == NaN) return;

      this.addedPhotosBuffer.queue.splice(listIdx, 1, '');

      this.addedPhotosBuffer.vizualizationContainer.removeChild(e.target);

      this.addedPhotosBuffer.checkIsListEmpty();
    }.bind(this), false)
    
    this.addedPhotosBuffer.vizualizationContainer.classList.remove("empty");
    this.addedPhotosBuffer.vizualizationContainer.appendChild(addedImgWrapper);

    this.previewContainer.removeChild(this.previewImgWrapper);

    this.suggestions.matches = [];

    Form.clear();

    this.addedPhotosBuffer.checkIsListEmpty();

    if(!this.addedPhotosBuffer.isListEmpty) this.addedPhotosBuffer.submitButton.disabled = false; 
  }


  static clear() {
    document.getElementById('photo-form').reset()
    // this.suggestions.matches = []
  }   
}

class FormSuggestions {
  constructor() {
    this.matches = []

    this.suggestionsContainer = document.getElementById('suggestion')
  }

  addSuggestion(element) {
    this.matches.push(element)
  }

  populateSuggestion() {
    while(this.suggestionsContainer.firstChild) {
      this.suggestionsContainer.removeChild(this.suggestionsContainer.firstChild)
    }

    this.matches.forEach(bird => {
      let suggestion = document.createElement('p')
      suggestion.innerText = bird.common 

      let sciName = document.createElement('i')
      sciName.innerText = bird.scientific

      suggestion.appendChild(document.createElement('br'))
      suggestion.appendChild(sciName)

      this.suggestionsContainer.appendChild(suggestion)
    })
  }
}

class AddedPhotosBuffer {
  constructor() {
    this.queue = []
    this.isEmpty = true

    this.vizualizationContainer = document.getElementById('images-submitted-preview')
    this.submitButton = document.getElementById('submit-all')

    this.setHandlers()
  }

  setHandlers() {
    this.submitButton.addEventListener('click', function() {
    this.handleSubmit()
    }, false)
  }

  checkIsListEmpty() {
    this.isEmpty = true

    this.queue.forEach(function (e) {
      if(typeof(e) === "object") this.isEmpty = false
    }.bind(this)) 

    if(this.isEmpty) {
      this.vizualizationContainer.classList.add("empty")
      this.submitButton.disabled = true
    }
  }

  handleSubmit() {
    const data = JSON.stringify(this.list)

    Api.post(data)

    this.clear()

    Form.clear()
  }

  clear() {
    this.list = []
    this.checkIsListEmpty()

    while(this.vizualizationContainer.lastElementChild.tagName === "SPAN") {
      this.vizualizationContainer.removeChild(this.vizualizationContainer.lastElementChild)
    }
  }
}


class App {
  constructor() {
    this.sectionNavigation = new SectionNavigation()
    this.editSection = new EditSection(this.sectionNavigation)

    this.addedPhotosBuffer = new AddedPhotosBuffer()

    this.form = new Form(this.addedPhotosBuffer)

    Api.getBirds()
  }
}

const app = new App()
