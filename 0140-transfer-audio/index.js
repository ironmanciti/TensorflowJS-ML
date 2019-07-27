let recognizer;

function predictWord() {
 // Array of words that the recognizer is trained to recognize.
 const words = recognizer.wordLabels();
 
 recognizer.listen(({scores}) => {
   // scores : Float32Array(20) - recognizer 의 wordLabels() 에 해당하는 
   // probability score
   // scores 를 (score,word) pair 의 array 로 변환
   scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
   // score 역순으로 정렬
   scores.sort((s1, s2) => s2.score - s1.score);
   document.querySelector('#console').textContent = scores[0].word;
   //max probability score 가 0.75 이상일 때만 callback 함수 invoke
 }, {probabilityThreshold: 0.75}); 
}

async function app() {
  //audio input type 지정: BROWSER_FFT - browser 내장 Fourier transform 사용
 recognizer = speechCommands.create('BROWSER_FFT');
 // model 과 metadata 가 load 되었는지 확인
 await recognizer.ensureModelLoaded();
 // recognizer 가 train 된 words list 
 console.log(recognizer.wordLabels());

 predictWord();
}

app();