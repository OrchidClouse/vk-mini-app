import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Div } from '@vkontakte/vkui';
import MainButton from './MainButton/MainButton';
import { makeStory } from '../utils/makeStory';
import { IMeme } from '../models/memeModel';

const MemePoster = () => {
  const [memes, setMemes] = useState<IMeme[]>([]);
  const [meme, setMeme] = useState<IMeme | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [accessToken, setAccessToken] = useState('');
  console.log(meme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        setMemes(data.data.memes);
        setMeme(
          data.data.memes[Math.floor(Math.random() * data.data.memes.length)]
        );
      } catch (error) {
        console.error('Ошибка при получении списка мемов:', error);
      }
    };

    fetchMemes();
  }, []);

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setMeme(memes[randomIndex]);
  };

  const handleShowImage = () => {
    if (!meme) return;

    bridge.send('VKWebAppShowImages', {
      images: [meme.url],
    });
  };

  useEffect(() => {
    bridge
      .send('VKWebAppGetAuthToken', {
        app_id: 53239479,
        scope: 'status,photos,wall',
      })
      .then((data) => {
        if (data.access_token) {
          setAccessToken(data.access_token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Div
      style={{
        textAlign: 'center',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {meme?.url && (
          <img
            onClick={handleShowImage}
            src={meme.url}
            alt='Мем'
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )}
      </Div>

      <Div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <MainButton
          onClick={getRandomMeme}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Показать другой мем
        </MainButton>
        <MainButton
          onClick={() => makeStory(meme)}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Опубликовать мем
        </MainButton>
      </Div>
    </Div>
  );
};

export default MemePoster;
