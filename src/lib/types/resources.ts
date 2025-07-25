export interface Resource {
  statusCode?: number;
  id: number;
  title: string;
  description: string;
  urls: string[];
  files: string[];
}
