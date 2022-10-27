let slideIndex = 1;
  showSlides(slideIndex);
  
  function plusSlides(n) {
    showSlides(slideIndex += n);
  }
  
  function currentSlide(n) {
    showSlides(slideIndex = n);
  }
  
  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
  }

  function websiteVisits(response) {
    badgevalue ="https://img.shields.io/badge/visitors-" + response.value +"-yellow"
    document.getElementById('visitorbadge').src = badgevalue;
  }
//Prediction using HF model - START
const sentimentsURL = 'https://huggingface-raj.herokuapp.com/api/get-classify'

class SentimentPrediction extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }
    set emotions(prediction) {
        //console.log(prediction);
        if (prediction.label == "POSITIVE") {
            this.root.innerHTML = `
            <p style="font-size:50px">&#128522;</p>
            ${prediction.score} + ${prediction.label}
            `;
        }
        if (prediction.label == "NEGATIVE") {
            this.root.innerHTML = `
            <p style="font-size:50px">&#128557;</p>
            ${prediction.score} + ${prediction.label}
            `;
        }

    }


}

customElements.define('sentiment-pred', SentimentPrediction)

btnWhatsUp.addEventListener('click', e => {
    var arrValues = new Array();
    arrValues.push(document.getElementById("txtemotion").value);
    //document.getElementById("lwsc3").innerHTML = txtemotion;
    var messages = arrValues;
    fetchSentiments(arrValues);
})



async function fetchSentiments(messages) {
    var payload = {
        "text": messages
    }
    //console.log(sentimentsURL)
    const json = await fetch(sentimentsURL,
        {
            mode: 'cors', // 'cors' by default, 'no-cors'
            method: 'POST',
            body: JSON.stringify(payload), // string or object
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function (response) {
            console.log("In Response status check", response.ok);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            // Read the response as json.
            return response.json();
        })
        .then(function (responseAsJson) {
            //console.log("In Response json data get");
            // Do stuff with the JSON
            //console.log(responseAsJson);
            //renderElements(responseAsJson);
            return responseAsJson
        })
        .catch(function (error) {
            console.log("In error");
            console.log('Looks like there was a problem: \n', error);
        });

    const main = document.querySelector('comic-text')

    json.classified.forEach(pred => {
        console.log(pred);
        const el = document.createElement('sentiment-pred');
        el.emotions = pred;
        main.appendChild(el);
    });

}
//Prediction using HF model - END