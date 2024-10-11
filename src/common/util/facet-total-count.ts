import { PipelineStage } from 'mongoose';

import { FacetPipelineStage } from '../types/facet-pipeline-stage';
import { pagination } from '../types/pagination';

/**
 * Returns a pipeline that can be used to get paginated results from a MongoDB collection.
 *
 * @param {pagination} [pag={limit: 20, skip: 0, order: 1, sortBy: '_id'}] - An object containing parameters to configure pagination, such as limit, skip, and sorting.
 * @param {PipelineStage[] | FacetPipelineStage[]} [pipeline=[]] - An array of pipeline stages that will be appended to the default pipeline to further filter or process results.
 * @return {PipelineStage[]} A pipeline that returns paginated results, as well as the total count of documents in the collection.
 */
export function facetTotalCount(
  pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' },
  pipeline: PipelineStage[] | FacetPipelineStage[] = [],
): PipelineStage[] {
  const SORT = pag.sort ?? { [pag.sortBy]: +pag.order, _id: +pag.order };

  const docsPipeline: any[] = [
    { $sort: SORT },
    { $skip: pag.skip },
    { $limit: pag.limit },
  ];

  return [
    {
      $facet: {
        docs: docsPipeline.concat(pipeline),
        totalCount: [
          {
            $count: 'count',
          },
        ],
      },
    },
    {
      $addFields: {
        totalCount: {
          $cond: {
            if: {
              $arrayElemAt: ['$totalCount.count', 0],
            },
            then: {
              $arrayElemAt: ['$totalCount.count', 0],
            },
            else: 0,
          },
        },
      },
    },
  ];
}
