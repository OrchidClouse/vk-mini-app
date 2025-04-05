import { FC, useState, useEffect } from 'react';
import { Div, NavIdProps, CardGrid, ContentCard } from '@vkontakte/vkui';

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

  return (
    <>
      {loading ? (
        <Div>Загрузка мемов...</Div>
      ) : (
        <Div
          style={{
            display: 'grid',
          }}
        >
          <CardGrid spaced size='s'>
            {memes.map((meme) => (
              <ContentCard
                key={meme.id}
                src={meme.url}
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
            ))}
          </CardGrid>
        </Div>
      )}
    </>
  );
};
