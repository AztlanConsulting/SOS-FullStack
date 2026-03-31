import axios from 'axios';

import type {
  SocialPublisher,
  PublishDTO,
  PublishResult,
} from '../../domain/ports/socialPublisher.port';

const BASE_URL = 'https://graph.facebook.com/v19.0';

/**
 * Generic helper function to make POST requests to the Meta API.
 * @param endpoint - API endpoint path (e.g., "/{page_id}/photos")
 * @param params - Key-value object containing query parameters
 * @returns The response data from the API
 */
const post = async (
  endpoint: string,
  params: Record<string, string | undefined>,
) => {
  const response = await axios.post(`${BASE_URL}${endpoint}`, null, {
    params,
  });

  return response.data;
};

export const metaPublisher: SocialPublisher = {
  /**
   * Publish an image post to Facebook.
   * @param data - Object containing imageUrl and optional caption
   * @returns PublishResult with the post ID and URL
   */
  async publishToFacebook(data: PublishDTO): Promise<PublishResult> {
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
    const PAGE_ID = process.env.FB_PAGE_ID;

    const res = await post(`/${PAGE_ID}/photos`, {
      url: data.imageUrl,
      caption: data.caption,
      access_token: ACCESS_TOKEN,
    });

    const postId = res.post_id;

    return {
      id: postId,
      url: `https://www.facebook.com/${postId}`, // Direct link to Facebook post
    };
  },

  /**
   * Publish an image post to Instagram.
   * Instagram requires a two-step process: create media container and then publish.
   * @param data - Object containing imageUrl and optional caption
   * @returns PublishResult with the media ID and permalink URL
   */
  async publishToInstagram(data: PublishDTO): Promise<PublishResult> {
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
    const IG_USER_ID = process.env.IG_USER_ID;

    // Create a media container
    const media = await post(`/${IG_USER_ID}/media`, {
      image_url: data.imageUrl,
      caption: data.caption,
      access_token: ACCESS_TOKEN,
    });

    // Publish the media container
    const publish = await post(`/${IG_USER_ID}/media_publish`, {
      creation_id: media.id,
      access_token: ACCESS_TOKEN,
    });

    const igMediaId = publish.id;

    // Retrieve permalink since Instagram doesn't return it directly
    const mediaInfo = await axios.get(`${BASE_URL}/${igMediaId}`, {
      params: {
        fields: 'permalink',
        access_token: ACCESS_TOKEN,
      },
    });

    return {
      id: igMediaId,
      url: mediaInfo.data.permalink, // Direct link to Instagram post
    };
  },
};
