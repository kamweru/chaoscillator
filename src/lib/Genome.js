import { NeuralNetwork } from "./NeuralNetwork";
import { getRandomFloat } from "./Utils";

class Genome {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.network = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
    this.fitness = 0;
    this.crossoverRate = getRandomFloat();
  }

  // Mutation function to slightly alter weights and biases
  mutate(rate) {
    const mutateValue = (value) =>
      Math.random() < rate ? value + Math.random() * 0.1 - 0.05 : value;

    this.network.weightsIH = this.network.weightsIH.map((row) =>
      row.map(mutateValue)
    );
    this.network.weightsHO = this.network.weightsHO.map((row) =>
      row.map(mutateValue)
    );
    this.network.biasH = this.network.biasH.map(mutateValue);
    this.network.biasO = this.network.biasO.map(mutateValue);
  }
  crossover(parent1) {
    let child = new Genome(
      parent1.network.inputNodes,
      parent1.network.hiddenNodes,
      parent1.network.outputNodes
    );

    for (let i = 0; i < parent1.network.weightsIH.length; i++) {
      for (let j = 0; j < parent1.network.weightsIH[i].length; j++) {
        child.network.weightsIH[i][j] =
          Math.random() > this.crossoverRate
            ? parent1.network.weightsIH[i][j]
            : this.network.weightsIH[i][j];
      }
    }

    for (let i = 0; i < parent1.network.weightsHO.length; i++) {
      for (let j = 0; j < parent1.network.weightsHO[i].length; j++) {
        child.network.weightsHO[i][j] =
          Math.random() > this.crossoverRate
            ? parent1.network.weightsHO[i][j]
            : this.network.weightsHO[i][j];
      }
    }

    child.network.biasH = child.network.biasH.map((_, i) =>
      Math.random() > this.crossoverRate
        ? parent1.network.biasH[i]
        : this.network.biasH[i]
    );
    child.network.biasO = child.network.biasO.map((_, i) =>
      Math.random() > this.crossoverRate
        ? parent1.network.biasO[i]
        : this.network.biasO[i]
    );
    child.mutate(0.5);
    return child;
  }
}

export { Genome };
