const firstWord = document.querySelector('#firstWord')
const firstWordDiv = document.querySelector('.firstWordDiv')
const secondWord = document.querySelector('h2')
const thirdWord = document.querySelector('h3')
const inputText = document.querySelector('#text')
const pointMark = document.querySelector('#points')
const body = document.querySelector('body')
const words = document.querySelector('#words')
const timerValues = document.querySelector('.values')
const countdown = document.querySelector('#countdown')
const btn = document.querySelector('.start')
const rules = document.querySelector('ul')

let timer = new easytimer.Timer()
let firstTimer = new easytimer.Timer()
let wordIndex = 0
let points = 0
inputText.style.display = 'none'
pointMark.style.display = 'none'

const wordsPrinted = () => {
    firstWord.textContent = ''
    for (let i = 0; i < mixedWords[wordIndex].length; i++) {
        const letter = document.createElement('span')
        letter.innerText = mixedWords[wordIndex][i]
        firstWord.append(letter)
    }
    secondWord.innerText = mixedWords[wordIndex + 1]
    thirdWord.innerText = mixedWords[wordIndex + 2]

}

const isCorrect = (key) => {
    if (key.key === 'Enter' || key.code === 'Space') {
        if (inputText.value.trim() === mixedWords[wordIndex]) {
            points++
            pointMark.innerText = `points: ${points}`
            firstWordDiv.classList.add('correct-word')
            setTimeout(() => {
                firstWordDiv.classList.remove("correct-word")
            }, 100)
        } else {
            firstWordDiv.classList.add('incorrect-word')
            setTimeout(() => {
                firstWordDiv.classList.remove("incorrect-word")
            }, 100)
        }
        wordIndex++;
        wordsPrinted();
        inputText.value = "";
    }
}

const addStyles = (event) => {
    inputText.value = inputText.value.trim()
    if (event.data === null) {
         if (inputText.value == firstWord.innerText) {
            console.log('good')
            firstWord.childNodes[firstWord.childNodes.length-1].classList.remove('incorrect')
            firstWord.childNodes[firstWord.childNodes.length-1].classList.add('correct')
        }
        firstWord.childNodes[inputText.value.length].className = ''
    
    }
    if (inputText.value.length > mixedWords[wordIndex].length) {
        firstWord.childNodes[mixedWords[wordIndex].length - 1].classList.add('incorrect')
    } else if (firstWord.innerText.startsWith(inputText.value)) {
        firstWord.childNodes[inputText.value.length - 1].classList.remove('incorrect')
        firstWord.childNodes[inputText.value.length - 1].classList.add('correct')
    } else {
        firstWord.childNodes[inputText.value.length - 1].classList.remove('correct')
        firstWord.childNodes[inputText.value.length - 1].classList.add('incorrect')
    }

}

const secondTenthUpd = (e) => {
    secondWord.style.display = 'none'
    thirdWord.style.display = 'none'
    firstWord.innerText = firstTimer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']);
}
const secondsUpdated = (e) => {
    timerValues.innerText = timer.getTimeValues().toString();
}

const firstTargetAchived = (e) => {

    timer.start({ countdown: true, startValues: { seconds: 30 } });
    timerValues.innerText = timer.getTimeValues().toString()
    timer.addEventListener('secondsUpdated', secondsUpdated);
    timer.addEventListener('targetAchieved', lastTargetAchived);

    secondWord.style.display = 'block'
    thirdWord.style.display = 'block'
    words.style.display = 'block'
    wordsPrinted()

    inputText.addEventListener('keyup', isCorrect)

    inputText.addEventListener('input', addStyles)
}

const lastTargetAchived = (e) => {
    fetch(`/scores/${points}/${lang}`)
    firstWord.style.display = 'none'
    secondWord.style.display = 'none'
    thirdWord.style.display = 'none'
    inputText.value = ''
    timerValues.innerText = `Words Per Minute: ${points * 2}`;
    inputText.style.display = 'none'
    btn.style.display = 'block'
    btn.innerText = 'Restart'
    pointMark.classList.add('timeout')
    countdown.classList.add('timeout')
    wordIndex += 3


    inputText.removeEventListener('keyup', isCorrect);
    inputText.removeEventListener('input', addStyles);
    firstTimer.removeEventListener('secondTenthsUpdated', secondTenthUpd);
    timer.removeEventListener('secondsUpdated', secondsUpdated);
    timer.removeEventListener('targetAchieved', lastTargetAchived)
    firstTimer.removeEventListener('targetAchieved', firstTargetAchived)
}



const focusInput = () => {
    inputText.focus()
}
btn.addEventListener('click', function () {
    points = 0;
    pointMark.innerText = `points: ${points}`
    inputText.style.display = 'block'
    pointMark.style.display = 'block'
    firstWord.style.display = 'block'
    btn.style.display = 'none'
    rules.style.display = 'none'
    pointMark.classList.remove('timeout')
    countdown.classList.remove('timeout')
    focusInput()

    firstTimer.start({ countdown: true, startValues: { seconds: 3 }, precision: 'secondTenths' });
    firstWord.innerText = firstTimer.getTimeValues().toString()
    firstTimer.addEventListener('secondTenthsUpdated', secondTenthUpd);

    firstTimer.addEventListener('targetAchieved', firstTargetAchived);

})








