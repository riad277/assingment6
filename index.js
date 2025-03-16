document.getElementById('learnbtn').addEventListener('click', function () {
    const learnSection = document.getElementById('learn-section');
    learnSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('faqbtn').addEventListener('click', function () {
    const accordianSection = document.getElementById('accordian');
    accordianSection.scrollIntoView({ behavior: 'smooth',block: 'start' });
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
         <button onclick="handleButtonClick(this, ${button.level_no})" class="btn text-[#422AD5] font-semibold px-5 border-2 border-[#422AD5]">
             <img src="assets/fa-book-open.png" alt="">Lesson-${button.level_no}
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
              <p class="text-2xl mt-2">নেক্সট Lesson এ যান</p>
            </div>
        `;
        defaultContent.style.display = 'none';
    } else {
        defaultContent.style.display = 'none';
        for (const card of cards) {
            // console.log(card.id)
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('bg-white', 'rounded-lg', 'mt-4');
            cardDiv.innerHTML = `
                <h1 class="text-center text-2xl font-bold mt-8 mb-2">${card.word}</h1>
                <p class="text-center text-xl mb-2">Meaning / Pronunciation</p>
                <p class="text-center">"${card.meaning} / ${card.pronunciation}"</p>
                <div class="flex justify-around mb-6">
                    <div onclick=loadCardDetails(${card.id}) class="bg-[#1A91FF30] p-3 rounded-lg"> <i  class="fa-solid fa-circle-info"></i></div>
                    <div class="bg-[#1A91FF30] p-3 rounded-lg"> <i class="fa-solid fa-volume-high"></i></div>
                </div>
            `;
            displayCard.append(cardDiv);
        }
    }
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
    <h1 class="text-3xl font-bold">${cardData.word}(<i class="fa-solid fa-microphone-lines"></i> : ${cardData.pronunciation})</h1>
    <p class="mt-2 font-bold">Meaning</>
    <p> ${cardData.meaning}</p>
    <p class="mt-2 font-bold"> Example</p>
    <p>${cardData.sentence}</p>
    <p class="mt-2 font-bold"> সমার্থক শব্দ গুলো</p>
    
    
    `
   


}




loadLessons();