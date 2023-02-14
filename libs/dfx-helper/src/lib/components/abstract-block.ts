import {Subscription} from 'rxjs';

export abstract class ABlock {
  protected subscriptions?: Subscription[];
  protected timeouts?: number[];
  protected intervals?: number[];

  unsubscribe(...subscription: Subscription[]): ABlock {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }

    this.subscriptions.push(...subscription);
    return this;
  }

  clearTimeout(...timeout: number[]): ABlock {
    if (!this.timeouts) {
      this.timeouts = [];
    }

    this.timeouts.push(...timeout);
    return this;
  }

  clearInterval(...interval: number[]): ABlock {
    if (!this.intervals) {
      this.intervals = [];
    }

    this.intervals.push(...interval);
    return this;
  }

  protected unsubscribeAll(): void {
    if (this.subscriptions) {
      for (const subscription of this.subscriptions) {
        subscription.unsubscribe();
      }
      this.subscriptions = undefined;
    }
    if (this.timeouts) {
      for (const timeout of this.timeouts) {
        clearTimeout(timeout);
      }
      this.timeouts = undefined;
    }

    if (this.intervals) {
      for (const interval of this.intervals) {
        clearInterval(interval);
      }
      this.intervals = undefined;
    }
  }
}
