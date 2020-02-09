// Linear Regression with tensorflow.js
const x_vals = [];     // stores points from mouse click
const y_vals = [];
const curveX = [];

let a, b, c;
const learningRate = 0.1;
const optimizer = tf.train.adam(learningRate);    //tensorflow optimizer
const loss = (pred, label) => pred.sub(label).square().mean();   //loss function 정의

function setup() {
  createCanvas(400, 400);
  a = tf.variable(tf.scalar(random(-1, 1)));     //a, b, c, d를 tensorflow 를 이용하여 train
  b = tf.variable(tf.scalar(random(-1, 1)));
  c = tf.variable(tf.scalar(random(-1, 1)));
  d = tf.variable(tf.scalar(random(-1, 1)));

  for (let x = -1; x < 1.05; x += 0.05){
    curveX.push(x);
  }
}

function predict(x_vals){                     //prediction
  const xs = tf.tensor1d(x_vals);

  //y = ax^2 + bx + c                         // quadratric equation (2차방정식)
  // let ys = xs.square().mul(a).add(xs.mul(b)).add(c);

  //y = ax^3 + bx^2 + cx + d                  // trigonomatric equation (3차방정식)
  let ys = xs.pow(tf.scalar(3)).mul(a)
          .add(xs.square().mul(b))
          .add(xs.mul(c))
          .add(d);
  return ys;
}

function mousePressed(){
  const x = map(mouseX, 0, width, -1, 1);
  const y = map(mouseY, 0, height, 1, -1);    //cartesian 좌표로 변환
  x_vals.push(x);               //feature
  y_vals.push(y);               //label
}

function mouseDragged(){
  const x = map(mouseX, 0, width, -1, 1);
  const y = map(mouseY, 0, height, 1, -1);    //cartesian 좌표로 변환
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
      let px = map(x_vals[i], -1, 1, 0, width);
      let py = map(y_vals[i], 1, -1, 0, height);
      point(px, py);
    }

    const ys = predict(curveX);
    const curveY = ys.dataSync();  //tensor 를 [value] 로 변환

    beginShape();
    noFill();
    stroke(255);
    strokeWeight(4);
    for (let i = 0; i < curveX.length; i++){
      let x = map(curveX[i], -1, 1, 0, width);
      let y = map(curveY[i], -1, 1, height, 0);
      vertex(x, y);
    }
    endShape();

    for (let i = 0; i < x_vals.length; i++){     //predict point 시각화
      let y_pred = predict([x_vals[i]]).dataSync();  //predict 는 [] 형식을 입력으로 받음
      let px = map(x_vals[i], -1, 1, 0, width);
      let py = map(y_pred[0], -1, 1, height, 0);   // yline 은 [value] 형태이므로 [0]
      stroke(255, 0, 0);
      strokeWeight(8);
      point(px, py);
    }
  });
}







//////////////////////////////////////////////////
