var counter1 = 0;
var counter2 = 1;
var counter3 = 2;
var counter4 = 3;

var ModalIndex

var BackIndex = 0;
var BackIndex1 = 1;

const Photos = ["IMG_0752-2","IMG_1818","IMG_2422","IMG_2446","IMG_2555","IMG_2785","IMG_3520-2","IMG_3553","IMG_3766","IMG_3774","IMG_4312","IMG_4336","IMG_4389","IMG_4459-2","IMG_4469","IMG_4565","IMG_5364","IMG_5376","IMG_5679-2","IMG_5940","IMG_6054","IMG_6201","IMG_6338","IMG_6676","IMG_7281","IMG_7350","IMG_7405","IMG_7849","IMG_7892","IMG_7925","IMG_8594","IMG_8617","IMG_8654","IMG_8684","IMG_8699","IMG_8702","IMG_8747","IMG_8877","IMG_8853","IMG_8882","IMG_8932","IMG_8959","IMG_9279-2","IMG_9480","IMG_9528[1]","IMG_9815[1]","IMG_25552"]

const BackgroundImg = ["IMG_4336","IMG_5768","IMG_6051","IMG_5783","IMG_7491"]

const Modal = {
    open(n){
        Modal.during()

        document.querySelector(".modal-overlay").classList.add("active")

        document.body.style.position = 'fixed';

        document.body.style.top = `-${window.scrollY}px`;

        if (n == 0) return DOM.ModalPhoto(counter1)

        if (n == 1) return DOM.ModalPhoto(counter2)

        if (n == 2) return DOM.ModalPhoto(counter3)

        if (n == 3) return DOM.ModalPhoto(counter4)
    },
    close(){
        document.querySelector(".modal-overlay").classList.remove("active")

        document.body.style.position = '';
        document.body.style.top = '';

        let height = window.innerHeight

        window.scrollTo(0, height)
    }, 
    during(){
        const target = document.querySelector('.modal')

        target.addEventListener('click', (event) => {
            const img = document.getElementById('modalImg')

            if(event.target !== img){
                Modal.close()
            }   
        })
    }
}

const DOM = {
    addPhotos() {
        let place = document.getElementById("m-photos-content")

        let code

        if(window.innerWidth > 700) {
            code = `
                    <button class="m-photos-btn" id="m-photos-btn-left" onclick="NextPhoto.prev()"><img src="./assets/left-arrow.svg" alt=""></button>
                    <div id="m-photos-container">
                        <div class="img-card"><img src="./photos/${Photos[counter1]}.jpg" alt="Photo" onclick="Modal.open(0)"></div>
                        <div class="img-card"> <img src="./photos/${Photos[counter2]}.jpg" alt="Photo" onclick="Modal.open(1)"></div>
                        <div class="img-card"> <img src="./photos/${Photos[counter3]}.jpg" alt="Photo" onclick="Modal.open(2)"></div>
                        <div class="img-card"> <img src="./photos/${Photos[counter4]}.jpg" alt="Photo" onclick="Modal.open(3)"></div>
                    </div>
                    <button class="m-photos-btn" id="m-photos-btn-right" onclick="NextPhoto.next()"><img src="./assets/right-arrow.svg" alt=""></button>
        `} else {
            code = 
            `
                    <button class="m-photos-btn" id="m-photos-btn-left" onclick="NextPhoto.prev()"><img src="./assets/left-arrow.svg" alt=""></button>
                    <div id="m-photos-container">
                        <div class="img-card"><img src="./photos/${Photos[counter1]}.jpg" alt="Photo" onclick="Modal.open(0)"></div>
                    </div>
                    <button class="m-photos-btn" id="m-photos-btn-right" onclick="NextPhoto.next()"><img src="./assets/right-arrow.svg" alt="">`
        }

        

        place.innerHTML = code
    },
    
    ModalPhoto(index){
        let container = document.getElementById("modal-img")

        let code = `<img id='modalImg' src="./photos/${Photos[index]}.JPG" alt="">`

        container.innerHTML = code

        return ModalIndex = index
    },

    BackgroundPhoto(n, m){
        let container = document.getElementById("background")

        let code = `<img class="background-image first front" src="./backgroundImages/${BackgroundImg[n]}.jpg" alt="Background Image">
                    <img class="background-image second" src="./backgroundImages/${BackgroundImg[m]}.jpg" alt="Background Image">`;

        container.innerHTML = code
    }
}

const NextPhoto = {
    next(){
        counter1 += 1;
        counter2 += 1;
        counter3 += 1;
        counter4 += 1;

        if(counter1 >= Photos.length){counter1 = 0}

        if(counter2 >= Photos.length){counter2 = 0}

        if(counter3 >= Photos.length){counter3 = 0}

        if(counter4 >= Photos.length){counter4 = 0}

        DOM.addPhotos()
        BackPhoto.Switch()
    },
    prev(){
        counter1 -= 1;
        counter2 -= 1;
        counter3 -= 1;
        counter4 -= 1;

        if(counter1 < 0){counter1 = Photos.length -1}

        if(counter2 < 0){counter2 = Photos.length -1}

        if(counter3 < 0){counter3 = Photos.length -1}

        if(counter4 < 0){counter4 = Photos.length -1}

        DOM.addPhotos()
    },

    ModalNext(){
        this.next()

        let nextPhoto = ModalIndex + 1

        if (nextPhoto >= Photos.length){ nextPhoto = 0}

        return DOM.ModalPhoto(nextPhoto)
    },

    ModalPrev(){
        this.prev()

        let prevPhoto = ModalIndex - 1

        if (prevPhoto < 0){prevPhoto = Photos.length -1}

        return DOM.ModalPhoto(prevPhoto)
    }
}

const Header = {
    Change(){
        let height = window.scrollY

        let doc = document.getElementById("header")

        if(height >= 100) {
            doc.style.backgroundColor = "#25283D"
        } else {
            doc.style.backgroundColor = "transparent"
        }
    }
}

const BackPhoto = {
    Switch(){
        BackIndex += 1;
        BackIndex1 += 1;

        if (BackIndex >= BackgroundImg.length){ BackIndex = 0}
        if (BackIndex1 >= BackgroundImg.length){ BackIndex1 = 0}

        return DOM.BackgroundPhoto(BackIndex, BackIndex1)
    }
}

const App = {
    init() {
        DOM.BackgroundPhoto(BackIndex, BackIndex1)

        setTimeout(() => {
            $('.first').removeClass('front')
            $('.second').addClass('front')
        }, 4000);

        setInterval(() => {
            BackPhoto.Switch()
            $('.first').addClass('front')
            setTimeout(() => {
                $('.first').removeClass('front')
                $('.second').addClass('front')
            }, 4000);
        }, 8000);

        DOM.addPhotos()       
    }
}


App.init()

addEventListener("resize", () => {
    if(window.innerWidth > 700) {
        DOM.addPhotos()
    } else {
        return DOM.addPhotos()
    }
})
