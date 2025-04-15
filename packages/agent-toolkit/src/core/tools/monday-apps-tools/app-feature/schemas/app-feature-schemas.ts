import { z } from 'zod';
import { MondayApiResponse } from '../../base-tool/monday-apps-tool';
import { AppFeatureType } from '../../consts/apps.consts';

export interface AppFeaturesResponse extends MondayApiResponse {
  [key: string]: any;
  length?: number;
}

export const getAppFeaturesSchema = z.object({
  appVersionId: z.number().describe('The ID of the app version to get features for'),
  type: z.nativeEnum(AppFeatureType).optional().describe('Filter by app feature type'),
});

export interface CreateAppFeatureResponse extends MondayApiResponse {
  id: number;
  app_id: number;
  app_version_id: number;
  name: string;
  type: AppFeatureType;
}

export const createAppFeatureSchema = z.object({
  appId: z.number().describe('The ID of the app'),
  appVersionId: z.number().describe('The ID of the app version'),
  name: z.string().describe('The name of the app feature'),
  type: z.nativeEnum(AppFeatureType).describe('The type of the app feature'),
  data: z.record(z.any()).optional().describe('Additional data for the app feature'),
});
