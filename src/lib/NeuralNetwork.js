class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    // Randomly initialize weights
    this.weightsIH = this.createRandomMatrix(this.hiddenNodes, this.inputNodes);
    this.weightsHO = this.createRandomMatrix(
      this.outputNodes,
      this.hiddenNodes
    );

    // Initialize biases
    this.biasH = this.createRandomArray(this.hiddenNodes);
    this.biasO = this.createRandomArray(this.outputNodes);
  }

  createRandomMatrix(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = Math.random() * 2 - 1; // Random values between -1 and 1
      }
    }
    return matrix;
  }

  createRandomArray(size) {
    let array = [];
    for (let i = 0; i < size; i++) {
      array[i] = Math.random() * 2 - 1;
    }
    return array;
  }

  // Activation function (Sigmoid)
  sigmoid(x) {
    let ap = -x / 1;
    return 1 / (1 + Math.exp(ap));
  }

  sigmoid1(x) {
    return 1 / (1 + Math.exp(-x));
  }

  dsigmoid(y) {
    return y * (1 - y);
  }

  tanh(x) {
    return Math.tanh(x);
  }

  dtanh(y) {
    return 1 - y * y;
  }

  // Feedforward function
  feedForward(inputArray) {
    // Generate hidden layer outputs
    let hidden = this.matrixMultiply(this.weightsIH, inputArray);
    hidden = this.addArray(hidden, this.biasH);
    hidden = hidden.map(this.tanh);

    // Generate output layer outputs
    let output = this.matrixMultiply(this.weightsHO, hidden);
    output = this.addArray(output, this.biasO);
    output = output.map(this.sigmoid);

    return output;
  }

  // Helper methods for matrix operations
  matrixMultiply(a, b) {
    let result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = 0;
      for (let j = 0; j < b.length; j++) {
        result[i] += a[i][j] * b[j];
      }
    }
    return result;
  }

  addArray(a, b) {
    return a.map((val, index) => val + b[index]);
  }
}

export { NeuralNetwork };
