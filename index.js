document.getElementById('nav1').style.display="none";
document.getElementById('learn-section').style.display="none";
document.getElementById('accordian').style.display="none";


document.getElementById('learnbtn').addEventListener('click', function () {
    const learnSection = document.getElementById('learn-section');
    learnSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('faqbtn').addEventListener('click', function () {
    const accordianSection = document.getElementById('accordian');
    accordianSection.scrollIntoView({ behavior: 'smooth',block: 'start' });
});
document.getElementById('logoutbtn').addEventListener('click', function () {
    document.getElementById('nav1').style.display="none";
    document.getElementById('learn-section').style.display="none";
    document.getElementById('accordian').style.display="none";
    document.getElementById('banner').style.display="flex";

});




document.getElementById('start-btn').addEventListener('click', function () {
    const inputName = document.getElementById('name').value.trim();
    const passwordNum = document.getElementById('password').value.trim();

    if (inputName === '' || passwordNum === '') {
        alert('Please fill both the name and password fields.');
        return;
    }

    if (passwordNum !== '123456') {
        alert('Incorrect password. Please enter the correct password.');
        return;
        
    }

    // console.log('Both fields are filled and the password is correct.');
    // alert('Welcome! You are now logged in.');

    document.getElementById('nav1').style.display = 'flex';
    document.getElementById('learn-section').style.display = 'block';
    document.getElementById('accordian').style.display = 'block';
    document.getElementById('banner').style.display = 'none';


});


function loadLessons() {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((data) => showButton(data.data))
        .catch((error) => console.error("Error fetching categories:", error));
}

function showButton(buttons) {
    const buttonContainer = document.getElementById('button-container');
    for (const button of buttons) {
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
         <button onclick="handleButtonClick(this, ${button.level_no})" class="btn poppins text-[#422AD5] font-semibold px-5 border-2 border-[#422AD5] hover:bg-[#ca3a3a] hover:text-white">
             <img  src="assets/fa-book-open.png" alt="">Lesson-${button.level_no}
         </button>
        `;
        buttonContainer.append(buttonDiv);
    }
}
let previouslyClickedButton = null;
function handleButtonClick(clickedButton, buttonId) {
    if (previouslyClickedButton) {
        previouslyClickedButton.classList.remove('bg-[#422AD5]', 'text-white');
        previouslyClickedButton.querySelector('img').classList.remove('filter', 'brightness-0', 'invert');
    }

    clickedButton.classList.add('bg-[#422AD5]', 'text-white');
    clickedButton.querySelector('img').classList.add('filter', 'brightness-0', 'invert');

    previouslyClickedButton = clickedButton;

    loadCards(buttonId);
}

function loadCards(buttonId) {
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/level/${buttonId}`)
        .then((res) => res.json())
        .then((data) => DisplayCards(data.data))
        .catch((error) => console.error("Error fetching cards:", error));
}

function DisplayCards(cards) {
    const displayCard = document.getElementById('display-card');
    const noContent = document.getElementById('no-content');
    const defaultContent = document.getElementById('default');

    displayCard.innerHTML = '';
    noContent.innerHTML = '';
    noContent.style.display = 'none';

    if (cards.length === 0) {
        noContent.style.display = 'block';
        noContent.innerHTML = `
            <div class="py-20 col-span-full flex flex-col justify-center items-center text-center">
               <img src="assets/alert-error.png" alt="">
              <p class="text-sm text-[#79716B] mt-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
              <p class="text-2xl text-[#292524] mt-2">নেক্সট Lesson এ যান</p>
            </div>
        `;
        defaultContent.style.display = 'none';
    } else {
        defaultContent.style.display = 'none';
        for (const card of cards) {
            // console.log(card.id)
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('bg-white', 'rounded-lg', 'mt-4', 'hover:bg-slate-100','shadow-xl');
            cardDiv.innerHTML = `
                <h1 class="text-center inter text-2xl font-bold mt-8 mb-2">${card.word}</h1>
                <p class="text-center inter font-medium text-xl mb-2">Meaning / Pronunciation</p>
                <p class="text-center hindSiliguri font-medium text-[#18181B] opacity-80 mb-2">"${card.meaning ? card.meaning : 'অর্থ নেই'} / ${card.pronunciation}"</p>
                <div class="flex justify-around mb-6">
                    <div onclick=loadCardDetails(${card.id}) class="bg-[#1A91FF30] p-3 rounded-lg"> <i  class="fa-solid fa-circle-info"></i></div>
                    <div class="bg-[#1A91FF30] p-3 rounded-lg"> <i class="fa-solid fa-volume-high"></i></div>
                </div>
            `;
            displayCard.append(cardDiv);
        }
        
    }
    hideLoader();
}


function loadCardDetails(cardId){
    // console.log(cardId)
    fetch(`https://openapi.programming-hero.com/api/word/${cardId}`)
    .then((res) => res.json())
    .then((data) => displaycardDetails(data.data ))
    .catch((error) => console.error("Error fetching cards:", error));
    
}
function displaycardDetails(cardData){
    console.log(cardData);
    // <button class="btn" onclick="my_modal_1.showModal()">open modal</button>
    document.getElementById('video_details').showModal();

    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML=`
    <div class="p-6 border border-[#EDF7FF] rounded-xl mb-6">
    <h1 class="text-3xl poppins font-bold">${cardData.word}(<i class="fa-solid fa-microphone-lines"></i> : ${cardData.pronunciation})</h1>
    <p class="mt-2 poppins font-bold">Meaning</>
    <p class="hindSiliguri mb-2"> ${cardData.meaning ? cardData.meaning : 'অর্থ পাওয়া যাই নি'}</p>
    <p class="mt-2 font-bold"> Example</p>
    <p class="poppins opacity-80">${cardData.sentence}</p>
    <p class="mt-2 hindSiliguri font-bold mb-2"> সমার্থক শব্দ গুলো</p>
     <div class="flex poppins opacity-80 flex-wrap gap-2">
     ${cardData.synonyms.map(synonym => `
      <button class="btn   bg-[#EDF7FF] border-none">${synonym}</button>
      `).join('')}
     </div>
     </div>
    
    `
   
   


}


const showLoader=()=>{
    document.getElementById('loader').classList.remove('hidden')
    document.getElementById('card-container').classList.add('hidden')
}
const hideLoader=()=>{
    document.getElementById('loader').classList.add('hidden')
    document.getElementById('card-container').classList.remove('hidden')
}




loadLessons();