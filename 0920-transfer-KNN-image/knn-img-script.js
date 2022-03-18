async function app() {
    // knnModel 생성
    

    // mobilenet load
    

    /*knn 분류기에 sample 추가
    parameter: logit - mobilenet의 출력 logit, id - class Id
    knn 분류기 train 을 위해 동일한 image sample 을 5 개씩 추가
    */
    function add_examples(logit, id) {
        
    }

    //모든 class 에 대해 MobileNet 의 logit 을 knnModel 에 example 로 add
    

    // test image 의 logit 을 구하여 다른 class example 들의 logit 과 유사도 측정
    
    // knn prediction
    
}

document.addEventListener("DOMContentLoaded", app);
