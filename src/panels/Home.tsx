import { FC, useState } from 'react';
import { Panel, Group, Div, NavIdProps } from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import MemePoster from '../components/MemePoster';
import { Catalog } from './Catalog';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id }) => {
  // const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const [stage, setStage] = useState<'main' | 'catalog'>('main');
  console.log(routeNavigator);

  const underline = {
    textDecoration: 'underline',
    textUnderlineOffset: 8,
    cursor: 'pointer',
  };

  return (
    <Panel id={id}>
      {/* {fetchedUser && (
        <Group>
          <Cell
            before={photo_200 && <Avatar src={photo_200} />}
            subtitle={city?.title}
          >
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )} */}

      <Group>
        <Div style={{ display: 'flex' }}>
          <Div
            style={stage === 'main' ? underline : { cursor: 'pointer' }}
            onClick={() => setStage('main')}
          >
            Главная
          </Div>
          <Div
            style={stage === 'catalog' ? underline : { cursor: 'pointer' }}
            onClick={() => setStage('catalog')}
          >
            Каталог
          </Div>
        </Div>
        <Div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h2>{stage === 'main' ? 'Главная' : 'Каталог'}</h2>
          {stage === 'main' ? (
            <Div>
              <MemePoster />
            </Div>
          ) : (
            <Div>
              <Catalog />
            </Div>
          )}
        </Div>
      </Group>
    </Panel>
  );
};
