export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear congruential generator
  private next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
    return this.seed / 2147483647;
  }

  // Get random number between min and max (inclusive)
  public between(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  public pick<T>(array: T[]): T {
    const index = this.between(0, array.length - 1);
    return array[index];
  }

  // Pick multiple unique elements from array
  public pickMultiple<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle([...array]);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  // Shuffle array using Fisher-Yates
  public shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.between(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Get random boolean with probability
  public boolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  // Generate a weighted random selection
  public weighted<T>(items: Array<{ item: T; weight: number }>): T {
    const totalWeight = items.reduce((sum, { weight }) => sum + weight, 0);
    let random = this.next() * totalWeight;
    
    for (const { item, weight } of items) {
      random -= weight;
      if (random <= 0) {
        return item;
      }
    }
    
    return items[items.length - 1].item;
  }
}