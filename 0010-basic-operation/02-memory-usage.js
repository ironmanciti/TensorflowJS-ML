// const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
// const b = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);

// //** 메모리 상의 tensor 갯수
// console.log(tf.memory().numTensors)

//** dispose - manually memory 관리
// a.dispose();
// console.log(tf.memory().numTensors);
// b.dispose();
// console.log(tf.memory().numTensors);

//**tidy - automatic memory 관리
//** 함수가 반환하지 않는 모든 tf.Tensor를 정리
// async function run() {
//     // 많은 수의 텐서 생성
//     for (let i = 0; i < 100; i++) {
//         const t = tf.tensor([i]);
//     }

//     // 생성된 텐서의 개수를 출력
//     document.write("100개의 tensor 생성: " + tf.memory().numTensors + "<br/>");

//     // tf.tidy를 사용하여 텐서를 생성하고 자동 삭제
//     tf.tidy(() => {
//         for (let i = 0; i < 200; i++) {
//             const t = tf.tensor([i]);
//         }
//         document.write("추가로 200 개의 tensor 생성 <br/>")
//     });

//     // tidy 이후 텐서의 개수를 출력
//     document.write("total tensor 수: " + tf.memory().numTensors);
// }

// run();

