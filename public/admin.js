const fileInput = document.getElementById('file-upload')
const fileInputContainer = document.getElementById('file-upload-container')
const imgContainer = document.createElement('span')
const uploadPreviewImg = document.createElement('img')

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


