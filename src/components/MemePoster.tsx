import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Div } from '@vkontakte/vkui';
import MainButton from './MainButton/MainButton';

const MemePoster = () => {
  const [memes, setMemes] = useState([]);
  const [memeUrl, setMemeUrl] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [accessToken, setAccessToken] = useState('');

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

  const handleShowImage = () => {
    bridge
      .send('VKWebAppShowImages', {
        images: [memeUrl],
      })
      .then((data) => {
        if (data.result) {
          // Нативный экран открыт
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
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
          console.log('tokin: ', data);
          setAccessToken(data.access_token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const postMemeToWall = async () => {
    try {
      if (!accessToken || !memeUrl) {
        console.error('Нет accessToken или memeUrl');
        return;
      }

      // 1. Получить upload_url через VK API
      const uploadServer = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getWallUploadServer',
        params: {
          access_token: accessToken,
          v: '5.131',
        },
      });

      const uploadUrl = uploadServer.response.upload_url;

      // 2. Скачать картинку и отправить как файл
      const blob = await fetch(memeUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append('photo', blob);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());

      // 3. Сохранить фото в альбом через VK API
      const saveResponse = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.saveWallPhoto',
        params: {
          access_token: accessToken,
          v: '5.131',
          photo: uploadResponse.photo,
          server: uploadResponse.server,
          hash: uploadResponse.hash,
        },
      });

      const savedPhoto = saveResponse.response[0];
      const attachment = `photo${savedPhoto.owner_id}_${savedPhoto.id}`;

      // 4. Показать диалог публикации
      await bridge.send('VKWebAppShowWallPostBox', {
        message: 'Вот мой мем!',
        attachments: attachment,
      });
    } catch (error) {
      console.error('Ошибка при публикации поста:', error);
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
            onClick={handleShowImage}
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
        <MainButton
          onClick={getRandomMeme}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Показать другой мем
        </MainButton>
        <MainButton
          onClick={postMemeToWall}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Опубликовать мем
        </MainButton>
      </Div>
    </Div>
  );
};

export default MemePoster;
