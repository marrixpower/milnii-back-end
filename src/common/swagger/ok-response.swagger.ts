import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

/**
 * Creates an API pagination response for the given model.
 *
 * @param {TModel} model - The model to create the API pagination response for.
 * @return {ReturnType<typeof applyDecorators>} - The API pagination response decorator.
 */
export const ApiModelOkResponse = <TModel extends Type<any>>(
  model: TModel,
  array = false,
) => {
  let responseSchema: ApiResponseOptions = {
    schema: {
      $ref: getSchemaPath(model),
    },
  };
  if (array) {
    responseSchema = {
      schema: {
        type: 'array',
        items: {
          $ref: getSchemaPath(model),
        },
      },
    };
  }

  return applyDecorators(ApiExtraModels(model), ApiOkResponse(responseSchema));
};
