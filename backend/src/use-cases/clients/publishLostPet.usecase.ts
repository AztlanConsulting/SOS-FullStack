import type {
  SocialPublisher,
  PublishDTO,
  PublishResult,
} from '../../domain/ports/socialPublisher.port';

// Result of publishing to both platforms,
// including id and URL for each one.
interface PublishSocialResult {
  facebook: PublishResult;
  instagram: PublishResult;
}

export const publishLostPet = async (
  publisher: SocialPublisher,
  data: PublishDTO,
): Promise<PublishSocialResult> => {
  // Execute both publications in parallel for better performance
  const [facebook, instagram] = await Promise.all([
    publisher.publishToFacebook(data),
    publisher.publishToInstagram(data),
  ]);

  return { facebook, instagram };
};
