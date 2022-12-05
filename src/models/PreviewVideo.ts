export interface PreviewVideoInterface {
  id: string;
  versionNumber: string;
  deliveryDetails: {
    video: string;
  };
  shotDetails: {
    id: string;
    name: string;
    artist: string;
    sourceURL: string;
  };
  projectDetails: {
    id: string;
    name: string;
    created: string;
    creator: string;
  };
  vendorDetails: {
    companyName: string;
    website: string;
  };
  serviceDetails: {
    id: string;
    name: string;
  };
  shotNotes: {
    id: string;
    noteType: string;
    note: string;
    createdBy: string;
    createdAt: string;
    attachments: {
      id: string;
      name: string;
      url: string;
    }[];
  }[];
  deliveryType: string;
  errorMessage: string;
}

export interface ShotInterface {
  id: string;
  name: string;
  artist: string;
  projectName: string;
}

export type PreviewVideoType = PreviewVideoInterface | undefined;
export type PreviewVideoListType = PreviewVideoInterface[];
