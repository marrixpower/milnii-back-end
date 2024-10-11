import { PipelineStage } from 'mongoose';

export type FacetPipelineStage =
  PipelineStage.Facet['$facet']['FacetPipelineStage'];
