const TRAIN_DATA_PATH = 'https://storage.googleapis.com/mlb-pitch-data/pitch_type_training_data.csv';
const TEST_DATA_PATH = 'https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv';
const TRAINING_DATA_LENGTH = 7000;
const TEST_DATA_LENGTH = 700;
const BATCH_SIZE = 512;

export class pitchData {
    constructor(){
        let csvTransform;
    }
    // normalization helper function
    normalize(value, min, max) {
        if (min === undefined || max === undefined) {
            return value;
        }
        return (value - min) / (max - min);
    }

    async load() {
        // csv data 불러오기 : tf.data.csvDataset object 반환
        const trainData =
            tf.data.csv(TRAIN_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })

        // feature 개수
        const numOfFeatures = (await trainData.columnNames()).length - 1;

        // feature normalization 을 위함 feature 별 min, max 값 구하기
        const featureValues = await trainData
            .map(({ xs, ys }) => Object.values(xs))
            .toArray();

        const featureTensor = tf.tensor2d(featureValues, [featureValues.length, numOfFeatures]);

        const [VX0_MIN, VY0_MIN, VZ0_MIN, AX_MIN, AY_MIN, AZ_MIN, START_SPEED_MIN, HAND_MIN]
            = featureTensor.min(0).dataSync();
        const [VX0_MAX, VY0_MAX, VZ0_MAX, AX_MAX, AY_MAX, AZ_MAX, START_SPEED_MAX, HAND_MAX]
            = featureTensor.max(0).dataSync();

        this.csvTransform =
            ({ xs, ys }) => {
                const values = [
                    this.normalize(xs.vx0, VX0_MIN, VX0_MAX),
                    this.normalize(xs.vy0, VY0_MIN, VY0_MAX),
                    this.normalize(xs.vz0, VZ0_MIN, VZ0_MAX),
                    this.normalize(xs.ax, AX_MIN, AX_MAX),
                    this.normalize(xs.ay, AY_MIN, AY_MAX),
                    this.normalize(xs.az, AZ_MIN, AZ_MAX),
                    this.normalize(xs.start_speed, START_SPEED_MIN, START_SPEED_MAX),
                    xs.left_handed_pitcher
                ];
                return { xs: values, ys: ys };
            }
    }

    normedData(isTrain){
        if (isTrain){
            return tf.data.csv(TRAIN_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })
                .map(this.csvTransform)
                .map(({ xs, ys }) => {
                    return { xs: Object.values(xs), ys: Object.values(ys) };
                })
                .shuffle(TRAINING_DATA_LENGTH)
                .batch(BATCH_SIZE)
        } else {
            return tf.data.csv(TEST_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })
                .map(this.csvTransform)
                .map(({ xs, ys }) => {
                    return { xs: Object.values(xs), ys: Object.values(ys) };
                })
                .batch(TEST_DATA_LENGTH);
        }
        
    }
}