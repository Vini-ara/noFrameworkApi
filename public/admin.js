var birds;

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
    this.addButton = document.getElementById("insertSelector");
    this.editButton =  document.getElementById("editSelector");
    this.addButton.addEventListener('click', this.SelectAddSection);
    this.editButton.addEventListener('click', this.SelectEditSection);
  }

  SelectEditSection() {
    this.addButton.classList.remove("active") 
    this.editButton.classList.add("active")

    this.editPhotoSection.classList.add("visible")
    this.addPhotoSection.classList.remove("visible")
  }

  SelectAddSection() {
    this.addButton.classList.add("active") 
    this.editButton.classList.remove("active")

    this.editPhotoSection.classList.remove("visible")
    this.addPhotoSection.classList.add("visible")
  }
}

class EditSection {
  constructor(sectionNavigation) {
    this.sectionNavigation = sectionNavigation
    this.sectionNavigation.editButton.addEventListener('click', this.MountEditSection)
  }

  async MountEditSection() {     
    const images = await Api.get();

    images.forEach((post) => {
      CardCreation(post, this.sectionNavigation.editPhotoSection);
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
  constructor(suggestions) {
    this.suggestions = suggestions

    this.formElement = document.getElementById('photo-form') 
    this.photoInput = document.getElementById('file-upload')
    this.commonNameInput = document.getElementById('bird-name')
    this.scientificNameInput = document.getElementById('scientific-name')

    this.previewContainer = document.getElementById('file-upload-container')
    this.previewImg = document.createElement('img')
    this.previewImgWrapper = document.createElement('span')
  }

  handlePhotoInput(e) {
    if(e.target.files.length === 0) return;

    var reader = new FileReader();

    reader.onload = function(a) {
      this.previewImg.src = a.target.result
    }

    reader.readAsDataURL(e.target.files[0]);

    this.previewImg.setAttribute('alt', "image preview");
    this.previewImg.classList.add("img-input-preview")

    this.previewImgWrapper.append(this.previewImg)
    this.previewContainer.appendChild(this.previewImgWrapper);
  }
  
  handleCommonNameFocus() {
    if(this.suggestions.matches.length > 0) this.suggestions.suggestionsContainer.classList.add('active');
  } 

  handleCommonNameInput(e) {
    this.suggestions.matches = [];

    if(e.target.value.length < 2) {
      this.suggestions.suggestionsContainer.classList.remove('active');
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

  clear() {
    this.formElement.reset()
    this.suggestions.matches = []
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


const Form = {
  form: document.getElementById('photo-form'),
  photo: {
    element: document.getElementById('file-upload'),
    input: e => {
      if(e.target.files.length === 0) return;

      var reader = new FileReader();

      reader.onload = function(a) {
        Form.preview.img.element.src = a.target.result
      }

      reader.readAsDataURL(e.target.files[0]);

      Form.preview.img.element.setAttribute('alt', "image preview");
      Form.preview.img.element.classList.add("img-input-preview")

      Form.preview.imgWrapper.element.append(Form.preview.img.element)

      Form.preview.container.element.appendChild(Form.preview.imgWrapper.element);
    }
  },
  commonName: {
    element: document.getElementById('bird-name'),
    focus: () => {
      if(Form.suggestion.matches.length > 0) Form.suggestion.container.element.classList.add('active');
    },
    input: e => {
      Form.suggestion.matches = [];

      if(e.target.value.length < 2) {
        Form.suggestion.container.element.classList.remove('active');
        return;
      }

      birds.forEach(bird => {
        if(bird.common.includes(e.target.value) && Form.suggestion.matches.length < 10)
          Form.suggestion.matches.push(bird);
      });

      populateSuggestion(Form.suggestion.matches);

      if(Form.suggestion.matches.length > 0) 
        Form.suggestion.container.element.classList.add('active');
      else 
        Form.suggestion.container.element.classList.remove('active');
    },
  },
  scientificName: {
    element: document.getElementById('scientific-name'),
  },
  preview: {
    container: {
      element: document.getElementById('file-upload-container')
    },
    imgWrapper: { 
      element: document.createElement('span'),
      click: () => {
        Form.photo.element.value = "";

        Form.preview.imgWrapper.element.removeChild(Form.preview.img.element);
        Form.preview.container.element.removeChild(Form.preview.imgWrapper.element);
      }
    },
    img: {
      element: document.createElement('img'),
    },
  }, 
  suggestion: {
    container: {
      element: document.getElementById('suggestion'),
      click: e => {
        if(e.target.nodeName.toLowerCase() === 'i') {
          Form.scientificName.element.value = e.target.innerText;
          Form.commonName.element.value = e.target.parentElement.innerText.split('\n')[0];
        } else {
          Form.scientificName.element.value = e.target.innerText.split('\n')[1];
          Form.commonName.element.value = e.target.innerText.split('\n')[0];
        }

        Form.suggestion.container.element.classList.remove('active')
      }
    },
    matches: [],
  },
  clear: () => {
    Form.form.reset();
    Form.suggestion.matches = [];
  }
};

const AddedPhotos = {
  container: document.getElementById('images-submitted-preview'),
  list: [],
  isListEmpty: true,
  checkIsListEmpty: () => {
    let isEmpty = true; 

    AddedPhotos.list.forEach(e => {
      if(typeof(e) === "object") isEmpty = false;
    })

    if(isEmpty) {
      AddedPhotos.list = [];
      AddedPhotos.container.classList.add("empty");
      AddedPhotos.submit.element.disabled = true;
    }

    AddedPhotos.isListEmpty = isEmpty;
  },
  submit: {
    element: document.getElementById('submit-all'),
    click: () => {
      const data = JSON.stringify(AddedPhotos.list);
      Api.post(data);
      AddedPhotos.clear();

      Form.clear();
    } 
  },
  clear: () => {
    AddedPhotos.list = [];
    AddedPhotos.checkIsListEmpty();

    while(AddedPhotos.container.lastElementChild.tagName === "SPAN") {
      AddedPhotos.container.removeChild(AddedPhotos.container.lastElementChild)
    }
  }
}

const App = {
  setUp: () => {
    document.addEventListener('click', e => {
      let clickXstart = e.target.getBoundingClientRect().x;
      let clickXend = e.target.getBoundingClientRect().x + e.target.getBoundingClientRect().width;
      let clickYstart = e.target.getBoundingClientRect().y;
      let clickYend = e.target.getBoundingClientRect().y + e.target.getBoundingClientRect().height;

      let safeZoneXstart = Form.suggestion.container.element.getBoundingClientRect().x;
      let safeZoneXend = Form.suggestion.container.element.getBoundingClientRect().x + Form.suggestion.container.element.getBoundingClientRect().width;
      let safeZoneYstart = Form.commonName.element.getBoundingClientRect().y;
      let safeZoneYend = Form.suggestion.container.element.getBoundingClientRect().y + Form.suggestion.container.element.getBoundingClientRect().height;

      if(!(clickXstart >= safeZoneXstart && clickXend <= safeZoneXend && clickYstart >= safeZoneYstart && clickYend <= safeZoneYend)) {
        Form.suggestion.container.element.classList.remove('active')
      }
    })

    Form.commonName.element.addEventListener('focusin', Form.commonName.focus)

    Form.commonName.element.addEventListener('input', Form.commonName.input)

    Form.suggestion.container.element.addEventListener('click', Form.suggestion.container.click)

    Form.photo.element.addEventListener('input', Form.photo.input)

    Form.preview.imgWrapper.element.addEventListener('click', Form.preview.imgWrapper.click);

    Form.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let fields = {
        commonName: Form.commonName.element.value,
        scientificName: Form.scientificName.element.value,
        image: Form.preview.img.element.src
      }

      AddedPhotos.list.push(fields)

      const addedImg = document.createElement('img')
      addedImg.src = fields.image;
      addedImg.alt = "image to be submitted"

      let addedImgWrapper = document.createElement('span');
      addedImgWrapper.classList.add('img-preview-wrapper');
      addedImgWrapper.classList.add(`${AddedPhotos.list.length - 1}`);
      addedImgWrapper.appendChild(addedImg);

      addedImgWrapper.addEventListener('click', (e) => {
        const listIdx = Number(e.target.classList[1]);

        if(listIdx == NaN) return;

        AddedPhotos.list.splice(listIdx, 1, '');

        AddedPhotos.checkIsListEmpty();

        AddedPhotos.container.removeChild(e.target);
      })
      
      AddedPhotos.container.classList.remove("empty");
      AddedPhotos.container.appendChild(addedImgWrapper);

      Form.preview.container.element.removeChild(Form.preview.imgWrapper.element);

      Form.suggestion.matches = [];

      Form.clear();

      AddedPhotos.checkIsListEmpty();

      if(!AddedPhotos.isListEmpty) AddedPhotos.submit.element.disabled = false; 
    })

    Page.nav.insert.element.addEventListener('click', Page.nav.insert.click);

    Page.nav.edit.element.addEventListener('click', Page.nav.edit.click);

    AddedPhotos.submit.element.addEventListener('click', AddedPhotos.submit.click);
  },
  init: async () => {
    let birdData = await fetch('brazilBirds.json').then(response => response.json());
    birds = birdData.birds
    App.setUp();
  }
}



await App.init();
