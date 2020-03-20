class RPSDataset {

  addExample(example, label, numClasses) {
    if (this.xs == null) {
      this.xs = example;
      this.ys = tf.tidy(() => {return tf.oneHot(tf.tensor1d([label]).toInt(), numClasses)});
    } else {
      const oldX = this.xs;
      const oldY = this.ys;
      this.xs = oldX.concat(example, 0);
      const y = tf.tidy(() => {return tf.oneHot(tf.tensor1d([label]).toInt(), numClasses)});
      this.ys = oldY.concat(y, 0);
      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
  }
  
}
