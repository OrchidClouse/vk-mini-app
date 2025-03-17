import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Button, Div } from '@vkontakte/vkui';

const MemePoster = () => {
  const [memes, setMemes] = useState([]);
  const [memeUrl, setMemeUrl] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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
        setMemeUrl(
          data.data.memes[Math.floor(Math.random() * data.data.memes.length)]
            .url
        );
      } catch (error) {
        console.error('Ошибка при получении списка мемов:', error);
      }
    };

    fetchMemes();
  }, []);

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setMemeUrl(memes[randomIndex].url);
  };

  const postMemeToWall = async () => {
    try {
      const response = await bridge.send('VKWebAppWallPost', {
        message: 'Смешной мем для вас!',
        attachments: memeUrl,
      });
      console.log('Пост опубликован:', response);
    } catch (error) {
      console.error('Ошибка при публикации:', error);
    }
  };

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
      <h2>Случайный мем</h2>

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
        {memeUrl && (
          <img
            src={memeUrl}
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
        <Button
          onClick={getRandomMeme}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Показать другой мем
        </Button>
        <Button
          onClick={postMemeToWall}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Опубликовать на стену
        </Button>
      </Div>
    </Div>
  );
};

export default MemePoster;
