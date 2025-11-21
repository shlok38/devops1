export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  YAML_JSON = 'YAML_JSON',
  BASE64 = 'BASE64',
  SSH_GEN = 'SSH_GEN',
  CRON = 'CRON',
  DOCKERFILE = 'DOCKERFILE',
  K8S_MANIFEST = 'K8S_MANIFEST'
}

export interface K8sResourceData {
  cpu: number;
  memory: number;
  replicas: number;
  totalCpu: number;
  totalMemory: number;
}

export interface DockerGenParams {
  language: string;
  version: string;
  port: string;
  envVars: string;
  extras: string;
}

export interface K8sGenParams {
  kind: string;
  name: string;
  image: string;
  replicas: number;
  namespace: string;
  port: number;
}
