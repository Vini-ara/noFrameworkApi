const fileInput = document.getElementById('file-upload')
const fileInputContainer = document.getElementById('file-upload-container')

fileInput.addEventListener('input', function(e) {
  if(e.target.files.length > 0) {
    var imgElem = document.createElement('img')
    var reader = new FileReader();

    reader.onload = function(a) {
      imgElem.src = a.target.result
    }

    reader.readAsDataURL(e.target.files[0]);

    console.log(imgElem);
    imgElem.setAttribute('alt', "image preview");
    imgElem.classList.add("img-input-preview")

    fileInputContainer.appendChild(imgElem);
  }
})