let langOption = document.querySelectorAll('select');
let fromText = document.querySelector('.fromText');
let transText = document.querySelector('.toTranslate');
let fromVoice = document.querySelector('.from');
let toVoice = document.querySelector('.to');
let cpyBtn = document.querySelector('.bx-copy');
let countValue = document.querySelector('.code_length');
let exchangeLang = document.querySelector('.bx-transfer');

// Populate language dropdowns
langOption.forEach((get, con) => {
  for (let countryCode in language) {
    let selected = "";
    if (con === 0 && countryCode === "en-GB") {
      selected = "selected";
    } else if (con === 1 && countryCode === "hi-IN") {
      selected = "selected";
    }
    let option = `<option value="${countryCode}" ${selected}>${language[countryCode]}</option>`;
    get.insertAdjacentHTML('beforeend', option);
  }
});

// Function to call backend Google Translate API proxy
async function translateViaBackend(content, from, to) {
  if (!content.trim()) return "";
  try {
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content, source: from, target: to }),
    });
    const data = await response.json();
    return data.translatedText || "Translation error";
  } catch (error) {
    console.error("Translation API Error:", error);
    return "Translation error";
  }
}


// Event listener for input - calls backend for translation
fromText.addEventListener('input', async function () {
  let content = fromText.value;
  let fromContent = langOption[0].value;
  let transContent = langOption[1].value;

  // Show loading while translating
  transText.value = "Translating...";

  // Call backend
  let translatedText = await translateViaBackend(content, fromContent, transContent);
  transText.value = translatedText;
});


// Speech synthesis for source text
fromVoice.addEventListener('click', function () {
  let fromTalk = new SpeechSynthesisUtterance(fromText.value);
  fromTalk.lang = langOption[0].value;
  speechSynthesis.speak(fromTalk);
});

// Speech synthesis for translated text
toVoice.addEventListener('click', function () {
  let fromTalk = new SpeechSynthesisUtterance(transText.value);
  fromTalk.lang = langOption[1].value;
  speechSynthesis.speak(fromTalk);
});

// Copy translated text to clipboard
cpyBtn.addEventListener('click', function () {
  navigator.clipboard.writeText(transText.value);
});

// Character count display
fromText.addEventListener('keyup', function () {
  countValue.innerHTML = `${fromText.value.length}/5,000`;
});

// Exchange source and target languages and text
exchangeLang.addEventListener('click', function () {
  let tempText = fromText.value;
  fromText.value = transText.value;
  transText.value = tempText;

  let tempOpt = langOption[0].value;
  langOption[0].value = langOption[1].value;
  langOption[1].value = tempOpt;
});
