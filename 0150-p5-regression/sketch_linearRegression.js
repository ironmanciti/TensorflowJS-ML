// Linear Regression with tensorflow.js
const x_vals = [];     // stores points from mouse click
const y_vals = [];

let m, b;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);    //tensorflow optimizer
const loss = (pred, label) => pred.sub(label).square().mean();   //loss function 정의

function setup() {
  createCanvas(400, 400);
  m = tf.variable(tf.scalar(random(1)));     //m, b 를 tensorflow 를 이용하여 train
  b = tf.variable(tf.scalar(random(1)));
}

function predict(x_vals){                    //prediction
  const xs = tf.tensor1d(x_vals);
  //y = mx + b
  let ys = m.mul(xs).add(b);
  return ys;
}

function mousePressed(){
  const x = map(mouseX, 0, width, 0, 1);
  const y = map(mouseY, 0, height, 1, 0);    //cartesian 좌표로 변환
  x_vals.push(x);               //feature
  y_vals.push(y);               //label
}

function draw(){

  tf.tidy(() => {                   //tensor memory automatic clean up
    if (x_vals.length > 0){
      let ys = tf.tensor1d(y_vals);       //label value 를 tensor 로 변환
      optimizer.minimize(() => loss(predict(x_vals), ys));  //loss 함수 minimize
    }
    background(0);
    stroke(255);
    strokeWeight(8);

    for (let i = 0; i < x_vals.length; i++){       //mouse click point 시각화
      let px = map(x_vals[i], 0, 1, 0, width);
      let py = map(y_vals[i], 1, 0, 0, height);
      point(px, py);
    }

    const xline = [0, 1];        // regression line 을 긋기위해서는 2 개의 point 만 필요
    const ys = predict(xline);
    const yline = ys.dataSync();  //tensor 를 [value] 로 변환

    let x1 = map(xline[0], 0, 1, 0, width);
    let x2 = map(xline[1], 0, 1, 0, width);

    let y1 = map(yline[0], 0, 1, height, 0);   //p5 좌표로 변환
    let y2 = map(yline[1], 0, 1, height, 0);

    strokeWeight(2);
    line(x1, y1, x2, y2);

    for (let i = 0; i < x_vals.length; i++){     //predict point 시각화
      let yline = predict([x_vals[i]]).dataSync();  //predict 는 [] 형식을 입력으로 받음
      let px = map(x_vals[i], 0, 1, 0, width);
      let py = map(yline[0], 0, 1, height, 0);   // yline 은 [value] 형태이므로 [0]
      stroke(255, 0, 0);
      strokeWeight(8);
      point(px, py);
    }
  });
}







//////////////////////////////////////////////////
