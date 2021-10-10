class RPSDataset {
  constructor() {
    this.labels = []
  }

  addExample(example, label) {
    if (this.xs == null) {
      this.xs = example;
      this.labels.push(label);
    } else {
      const oldX = this.xs;
      this.xs = oldX.concat(example, 0);
      this.labels.push(label);
      oldX.dispose();
    }
  }
  
  encodeLabels(numClasses) {
    for (var i = 0; i < this.labels.length; i++) {
      if (this.ys == null) {
        this.ys = tf.tidy(
            () => {return tf.oneHot(
                tf.tensor1d([this.labels[i]]).toInt(), numClasses)});
      } else {
        const y = tf.tidy(
            () => {return tf.oneHot(
                tf.tensor1d([this.labels[i]]).toInt(), numClasses)});
        const oldY = this.ys;
        this.ys = tf.keep(oldY.concat(y, 0));
        oldY.dispose();
        y.dispose();
      }
    }
  }
}