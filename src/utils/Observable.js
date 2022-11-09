export default class Observable {
  constructor(caller) {
    this.observers = [];
    this.caller = caller;
  }

  subscribe(func) {
    this.observers.push(func);
  }

  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data) {
    this.observers.forEach((observer) => {
      const boundObserver = observer.bind(this.caller);
      boundObserver(data);
    });
  }
}
