import { Connection, Schema } from 'mongoose';

interface IOptions {
  field?: string;
  start?: number;
}

export class SequenceFactory {
  constructor(
    readonly connection: Connection,
    readonly options: IOptions = {},
  ) {
    this.options = {
      ...{
        field: 'id',
        start: 1,
      },
      ...options,
    };
    this.createCounterModel();
  }

  createCounterModel() {
    const modelName = 'Counter';
    const CounterSchema = new Schema(
      {
        id: { type: String, required: true },
        count: {
          type: Number,
          default: this.options.start,
          required: true,
        },
      },
      {
        collection: modelName,
        validateBeforeSave: false,
        versionKey: false,
        _id: false,
      },
    );

    if (this.connection.modelNames().indexOf(modelName) >= 0) {
      return this.connection.model(modelName);
    }

    CounterSchema.index({ id: 1, reference_value: 1 }, { unique: true });

    return this.connection.model(modelName, CounterSchema);
  }

  plugin(schema: Schema) {
    const options = this.options;

    schema.pre('save', async function (next) {
      const { value } = await this.db
        .collection('Counter')
        .findOneAndUpdate(
          { id: this.collection.name },
          { $inc: { count: 1 } },
          { upsert: true },
        );

      this[options.field] = value?.count + 1 || options.start;

      return next();
    });
  }
}
