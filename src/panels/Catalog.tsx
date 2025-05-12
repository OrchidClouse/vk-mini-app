import { FC, useState, useEffect } from 'react';
import { Div, NavIdProps, CardGrid, ContentCard } from '@vkontakte/vkui';
import { makeStory } from '../utils/makeStory';

export const Catalog: FC<NavIdProps> = () => {
  const [memes, setMemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        setMemes(data.data.memes);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении списка мемов:', error);
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const getSize = window.screen.width < 500 ? 'l' : 's';

  return (
    <>
      {loading ? (
        <Div>Загрузка мемов...</Div>
      ) : (
        <Div>
          <CardGrid
            style={{
              display: 'flex',
              width: '100%',
              overflowX: 'hidden',
            }}
            spaced
            size={getSize}
          >
            {memes.map((meme) => {
              return (
                <ContentCard
                  onClick={() => makeStory(meme)}
                  key={meme.id}
                  src={meme.url}
                  style={{ width: 260 }}
                  header={
                    <Div
                      style={{
                        padding: 0,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meme.name}
                    </Div>
                  }
                  maxHeight={300}
                  height={300}
                />
              );
            })}
          </CardGrid>
        </Div>
      )}
    </>
  );
};
