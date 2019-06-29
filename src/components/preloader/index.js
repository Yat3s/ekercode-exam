import React from 'react';
import styled from 'styled-components';

import { ImagePreloader } from '@/utils/preloader';

const Root = styled.div`
  position: fixed;
  padding: 0 40px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #1d2b43;
`;

const TextHint = styled.div`
  color: white;
  margin-bottom: 10px;
`;

const ProgressbarContainer = styled.div`
  width: 100%;
  z-index: 2;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const Progressbar = styled.div`
  height: 100%;
  background-color: #1b9cfd;
  width: ${p => 100 * p.percentage}%;
  transition: all 300ms ease;
`;

const imagePreloader = new ImagePreloader();

export default function Preloader({ images, onPreloadComplete, children }) {
  const loadedCountRef = React.useRef(0);
  const [loadedCount, setLoadedCount] = React.useState(loadedCountRef.current);
  const handleLoaded = React.useCallback(() => {
    loadedCountRef.current += 1;
    // setLoadedCount(c => c + 1);
    setLoadedCount(loadedCountRef.current);
  }, []);
  // 预加载是否完成，因为需要延时，所以需要增加这个状态
  const [preloadComplete, setPreloadComplete] = React.useState(false);

  React.useEffect(() => {
    let timer;
    initialize();

    async function initialize() {
      try {
        await imagePreloader.load({ images, onLoaded: handleLoaded });
      } catch (error) {
        console.error('出现了图片加载失败的情况', error);
      } finally {
        timer = setTimeout(
          () => {
            onPreloadComplete(loadedCountRef.current, images.length);
            // 为了避免加载太快导致闪屏，题目加载完后在一定延时后标识预加载完成
            setPreloadComplete(true);
          },
          process.env.NODE_ENV === 'development' ? 0 : 1000,
        );
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [handleLoaded, images, onPreloadComplete]);

  return !preloadComplete ? (
    <Root>
      <TextHint>资源加载...</TextHint>
      <ProgressbarContainer>
        <Progressbar percentage={loadedCount / images.length} />
      </ProgressbarContainer>
    </Root>
  ) : (
    children()
  );
}

Preloader.defaultProps = {
  images: [],
  onPreloadComplete: () => {},
  children: () => {},
};
