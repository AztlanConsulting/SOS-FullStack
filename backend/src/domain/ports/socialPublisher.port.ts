export interface PublishDTO {
  imageUrl: string;
  caption?: string;
}

export interface PublishResult {
  id: string;
  url: string;
}

export interface SocialPublisher {
  publishToFacebook(data: PublishDTO): Promise<PublishResult>;
  publishToInstagram(data: PublishDTO): Promise<PublishResult>;
}
