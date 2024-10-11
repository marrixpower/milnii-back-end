import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Creates an API pagination response for the given model.
 *
 * @param {TModel} model - The model to create the API pagination response for.
 * @return {ReturnType<typeof applyDecorators>} - The API pagination response decorator.
 */
export const ApiPaginationResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        properties: {
          docs: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
            description: 'Queried docs',
          },
          totalCount: {
            type: 'number',
            description: 'Docs total count',
          },
        },
      },
    }),
  );
};
