import { GeneratorFn, HookFn, GeneratorFnOptions } from './types';

export class FactoryBuilder<T, F> {
  private afterCreate?: HookFn<T>;
  constructor(
    private generator: GeneratorFn<T, F>,
    private factories: F,
    private sequence: number,
    private params: Partial<T>,
  ) {}

  build() {
    const object = {} as T; // kinda lying. Might be a problem
    const generatorOptions: GeneratorFnOptions<T, F> = {
      sequence: this.sequence,
      afterCreate: this.setAfterCreate,
      factories: this.factories,
      instance: object,
      params: this.params,
    };

    const tmpObject: T = {
      ...this.generator(generatorOptions),
      ...this.params,
    };

    Object.assign(object, tmpObject);

    this._callAfterCreate(object);
    return object;
  }

  setAfterCreate = (hook: HookFn<T>) => {
    this.afterCreate = hook;
  };

  _callAfterCreate(object: T) {
    if (this.afterCreate) {
      if (typeof this.afterCreate === 'function') {
        this.afterCreate(object);
      } else {
        throw new Error('"afterCreate" must be a function');
      }
    }
  }
}