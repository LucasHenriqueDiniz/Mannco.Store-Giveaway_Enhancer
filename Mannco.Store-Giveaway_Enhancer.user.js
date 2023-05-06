// ==UserScript==
// @name         Mannco.Store Giveway Enhancer
// @namespace    https://github.com/LucasHenriqueDiniz
// @version      0.15
// @description  create a buttons to easily join manncogiveways and other funcionalities
// @author       Lucas Diniz
// @license      MIT
// @match        *://mannco.store/giveaways
// @match        *://mannco.store/*/giveaways
// @icon         https://cdn-icons-png.flaticon.com/512/4470/4470928.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none

// @homepageURL  https://github.com/LucasHenriqueDiniz/Mannco.Store-Giveway_Enhancer
// @supportURL   https://github.com/LucasHenriqueDiniz/Mannco.Store-Giveway_Enhancer/issues
// @downloadURL  https://github.com/LucasHenriqueDiniz/Mannco.Store-Giveway_Enhancer/raw/main/Mannco.Store-Giveway_Enhancer.user.js
// @updateURL    https://github.com/LucasHenriqueDiniz/Mannco.Store-Giveway_Enhancer/raw/main/Mannco.Store-Giveway_Enhancer.user.js
// ==/UserScript==

(function () {
  // join and leave giveway functions
  function join(url) {
    let raffle = url;
    $.ajax({
      method: "GET",
      xhrFields: {
        withCredentials: true
      },
      url: `/requests/raffle.php?mode=join&url=${url}`
    }).done(function (response) {
      if (response.indexOf('ok') != -1) {
        console.log('.rafflejoined')
        $('.rafflejoined').show();
        $('.raffleenter').hide();
      } else {
        Type.alert.error('Error', "This is full");
      }
    });
  }
  function leave(url) {
    let raffle = url;
    $.ajax({
      method: "GET",
      xhrFields: {
        withCredentials: true
      },
      url: `/requests/raffle.php?mode=leave&url=${url}`
    }).done(function (response) {
      if (response.indexOf('ok') != -1) {
        console.log('.raffleenter')
        $('.raffleenter').show();
        $('.rafflejoined').hide();
      } else {

      }
    });
  }
  function True(button) {
    button.setAttribute('value', 'true');
    Type.alert.success('Sucess!', 'You entered the giveway')
    button.textContent = 'Leave';
    button.style.backgroundColor = 'red';
    console.log(button.value = true)

  }
  function Leave(button) {
    Type.alert.error(':(', 'You left the giveway')
    button.setAttribute('value', 'false');
    button.textContent = 'Enter';
    button.style.backgroundColor = 'green';
    console.log(button.value = false)
  }
  // Seleciona o elemento onde o texto será adicionado
  const header = document.querySelector("#wrapper > div.page-header > div > div");
  // Cria o elemento span e adiciona o texto inicial
  const missingText = document.createElement("button");
  missingText.textContent = "Missing 0 giveaways!";
  missingText.title = 'click to go to the next missing Giveaways'
  missingText.style.cssText = `
    font-family: -apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji;
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
    -webkit-appearance: button;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    line-height: 1.5;
    border-radius: 2rem;
    margin-right: 1rem!important;
    padding: .75rem 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: red;
    border: none;
    cursor: pointer;
    background-color: #2b2c45;
    margin-left: 15px;
`
  function findMissingGiveaways() {
    console.log('clicked')
    const elements = document.querySelectorAll("[style*='border-left: 3px solid rgb(16, 17, 34)']");
    if (elements.length > 0) {
      elements[0].focus();
    }
  }
  missingText.onclick = function (event) {
    findMissingGiveaways()
  }

  document.querySelector("#wrapper > div.page-header > div > div").insertBefore(missingText, document.querySelector("#wrapper > div.page-header > div > div").children[1]); // Insere o novo elemento antes do segundo filho
  let missingGiveaways = 0

  function givewayMissing() {
    missingGiveaways++
    missingText.textContent = `Missing ${missingGiveaways} giveways!`;
  }

  window.addEventListener('load', function () {
    //misc welcome message, show all raffles, remove navegator
    Type.alert.success('Welcome', '')
    Type.createPagination(1000, 1, 'raffleitem', '')
    document.querySelector("#main > div > nav").remove()
    // Cache DOM queries
    const parentElement = document.querySelector("#main > div > div").parentElement;
    const referenceElements = document.querySelectorAll("#main > div > div > a");

    //border in raffles already joined
    function EXECUTADA(raffles) {

      for (let i = 0; i < referenceElements.length; i++) {
        const href = referenceElements[i].href;
        const giveawayId = href.split("/giveaways/details/").pop();
        if (raffles.indexOf(giveawayId) != -1) {
          referenceElements[i].style.borderLeft = '3px solid lime';
          referenceElements[i].value = true


        } else {
          referenceElements[i].value = false
          referenceElements[i].style.borderLeft = '3px solid #101122';
          givewayMissing()
        }
      }
    }

    //fetch the joinedraffles for some reason the Raffles.joined is bugged
    fetch("https://mannco.store/requests/raffle.php?mode=getJoined")
      .then(response => response.text())
      .then(data => {
        const raffles = data.split(',');
        EXECUTADA(raffles);
      })
      .catch(error => console.error(error));

    // Define the CSS display property of the parent element as flex
    parentElement.style.display = "flex";
    // Create a new div element
    const newElement = document.createElement("div");
    // Set some properties for the new div element
    newElement.classList.add("raffle-buttons");
    newElement.style.flexGrow = "1";
    newElement.style.flexShrink = "1";
    // Add the new element to the parent element
    parentElement.appendChild(newElement);

    // Loop through reference elements
    for (let i = 0; i < referenceElements.length; i++) {

      //create the buttons
      const button = document.createElement('button');
      button.textContent = 'Enter';
      button.value = false
      button.style.cssText =
        `border-radius: 0;
              font-family: inherit;
              overflow: visible;
              text-transform: none;
              -webkit-appearance: button;
              cursor: pointer;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
              font-weight: 500;
              transition: color .125s ease-in-out;
              width: 25%;
              border: none;
              background-color: #3a3c5f;
              color: #fff;
              align-content: space-around;
              display: flex;
              justify-content: space-between;
              box-sizing: border-box;
              border-bottom: 1px solid #232439;
              margin: 0;
              padding: 1.5rem 4.5rem 1.5rem 2rem;
              text-align: inherit;
              position: relative;
              `;
      missingText.addEventListener('mouseenter', () => {
        missingText.style.transition = 'background-color 0.3s ease-in-out';
        missingText.style.backgroundColor = '#3a3b5e';
      });

      missingText.addEventListener('mouseleave', () => {
        missingText.style.backgroundColor = '#2b2c45';
      });
      //add the border radius to 1 and last element
      if (i === 0) {
        button.style.borderTopLeftRadius = '1rem';
        button.style.borderTopRightRadius = '1rem';
        button.style.borderTop = 'solid';
        button.style.borderColor = '#161726';
        button.style.borderWidth = "thin";
      } else if (i === referenceElements.length - 1) {
        button.style.borderBottomRightRadius = '1rem';
        button.style.borderBottomLeftRadius = '1rem';
        button.style.borderBottom = 'solid';
        button.style.borderColor = '#161726';
        button.style.borderWidth = "thin";
      }

      // make the buttons height the same as the elements
      const referenceRectX = referenceElements[i].getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const widthDiff = referenceRectX.width - buttonRect.width;
      button.style.height = `${buttonRect.height + widthDiff}px`;
      const referenceRect = parentElement.getBoundingClientRect();

      // Set the dimensions of the new element
      newElement.style.width = '5%';
      newElement.style.justifyContent = 'space-between';
      newElement.style.display = 'flex';
      newElement.style.flexDirection = 'column';
      newElement.style.height = `${referenceRect.height}px`;
      newElement.appendChild(button);

      button.onclick = function (event) {
        let url = referenceElements[i].href.replace('https://mannco.store/giveaways/details/', '')
        if (button.getAttribute('value') === 'false') {
          True(button)
          join(url)
          referenceElements[i].style.borderLeft = '3px solid lime';

        } else {
          Leave(button)
          leave(url)
          referenceElements[i].style.borderLeft = '3px solid #101122';

        }
      };

      //check if is already in the giveway
      setTimeout(() => {
        console.log('1!')
        if (referenceElements[i].style.borderLeft === '3px solid lime') {
          console.log('true')
          button.setAttribute('value', 'true');
          button.textContent = 'Leave';
          button.style.backgroundColor = 'red'
        } else {
          console.log('false')
          button.setAttribute('value', 'false');
          button.textContent = 'Enter';
          button.style.backgroundColor = 'green'
        }
      }, 1500);
    };
  })
})();
