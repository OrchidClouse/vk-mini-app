import bridge from '@vkontakte/vk-bridge';
import { IMeme } from '../models/memeModel';

export const makeStory = async (meme: IMeme) => {
  try {
    await bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      url: meme.url,
      attachment: {
        text: 'book',
        type: 'photo',
        owner_id: 743784474,
        id: 12345678,
      },
    });
  } catch (error) {
    console.error('Ошибка при отправке мема:', error);
  }
};
