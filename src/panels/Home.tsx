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
  const routeNavigator = useRouteNavigator();
  const [stage, setStage] = useState<'main' | 'catalog'>('main');
  console.log(routeNavigator);

  const underline = {
    textDecoration: 'underline',
    textUnderlineOffset: 8,
    cursor: 'pointer',
  };

  const getMargin = window.screen.width < 500 ? 36 : 0;

  return (
    <Panel id={id}>
      <Group>
        <Div style={{ display: 'flex', marginTop: getMargin }}>
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
