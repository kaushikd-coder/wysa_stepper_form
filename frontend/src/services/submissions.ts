import { api } from "./api";
import {
  ApiResponse,
  FormConfig,
  FormConfigListItem,
  Submission,
  SubmissionAnswers,
  SubmissionListItem,
} from "@/types";

export const getFormConfigs = async (): Promise<FormConfigListItem[]> => {
  const { data } = await api.get<ApiResponse<FormConfigListItem[]>>(
    "/api/form-configs"
  );
  return data.data;
};

export const getFormConfig = async (id: string): Promise<FormConfig> => {
  const { data } = await api.get<ApiResponse<FormConfig>>(
    `/api/form-configs/${id}`
  );
  return data.data;
};

export const getSubmissions = async (): Promise<SubmissionListItem[]> => {
  const { data } = await api.get<ApiResponse<SubmissionListItem[]>>(
    "/api/submissions"
  );
  return data.data;
};

export const getSubmission = async (id: string): Promise<Submission> => {
  const { data } = await api.get<ApiResponse<Submission>>(
    `/api/submissions/${id}`
  );
  return data.data;
};

export const createSubmission = async (
  formConfigId: string
): Promise<Submission> => {
  const { data } = await api.post<ApiResponse<Submission>>("/api/submissions", {
    formConfigId,
  });
  return data.data;
};

export const saveDraft = async (
  id: string,
  payload: {
    currentStepIndex: number;
    completedStepIds: string[];
    answers: SubmissionAnswers;
  }
): Promise<Submission> => {
  const { data } = await api.patch<ApiResponse<Submission>>(
    `/api/submissions/${id}/draft`,
    payload
  );
  return data.data;
};

export const completeSubmission = async (
  id: string,
  answers: SubmissionAnswers
): Promise<Submission> => {
  const { data } = await api.post<ApiResponse<Submission>>(
    `/api/submissions/${id}/complete`,
    { answers }
  );
  return data.data;
};

export const deleteSubmission = async (id: string): Promise<void> => {
  await api.delete(`/api/submissions/${id}`);
};
