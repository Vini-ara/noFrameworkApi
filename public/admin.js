var birds;

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

    AddedPhotos.submit.element.addEventListener('click', AddedPhotos.submit.click);
  },
  init: async () => {
    let birdData = await fetch('brazilBirds.json').then(response => response.json());
    birds = birdData.birds
    App.setUp();
  }
}

const Api = {
  post: async (body) => {
    const opt = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: body
    };

    await fetch('/api/images', opt);
  }
}

function populateSuggestion(matches) {
  while(Form.suggestion.container.element.firstChild) {
    Form.suggestion.container.element.removeChild(Form.suggestion.container.element.firstChild)
  }

  matches.forEach(bird => {
    let suggestion = document.createElement('p')
    suggestion.innerText = bird.common 

    let sciName = document.createElement('i')
    sciName.innerText = bird.scientific

    suggestion.appendChild(document.createElement('br'))
    suggestion.appendChild(sciName)

    Form.suggestion.container.element.appendChild(suggestion)
  })
}

await App.init();
