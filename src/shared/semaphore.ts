// This file consists of code modified from code whose copyright and
// licence information follow.

// Copyright (c) 2021-2023 Christopher Meyer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export class SemaphoreItem {
  private queue: Array<Function>;
  private maxConcurrent: number;
  private count: number;

  constructor(maxConcurrent: number) {
    this.queue = [];
    this.maxConcurrent = maxConcurrent;
    this.count = 0;
  }

  get canAcquire(): boolean {
    return this.count < this.maxConcurrent;
  }

  acquire(): Promise<void> {
    if (this.canAcquire) {
      this.count++;
      return Promise.resolve();
    } else {
      return new Promise((resolve) => this.queue.push(resolve));
    }
  }

  release(): void {
    const resolveFunc = this.queue.shift();

    if (resolveFunc) {
      setTimeout(resolveFunc, 0);
    } else {
      this.count--;
    }
  }
}
