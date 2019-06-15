class TimeoutError extends Error {
  constructor(url, timeout) {
    super(`图片 [${url}] 加载时长超过 ${timeout}ms`);
  }
}

export class ImagePreloader {
  loadedImages = {};

  loadImage({ image, timeout, onLoaded, onError }) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutTimer = setTimeout(() => {
        reject(new TimeoutError(image, timeout));
      }, timeout);
      img.onload = () => {
        this.loadedImages[image] = true;
        clearTimeout(timeoutTimer);
        onLoaded(image);
        // console.log(`image ${image} loaded`);
        resolve(image);
      };
      img.onerror = (event, source, lineno, colno, error) => {
        onError(error, image);
        reject(error);
      };
      img.src = image;
    });
  }

  load({ images, timeout = 10000, onLoaded = () => {}, onError = () => {} }) {
    return Promise.all(
      images.map(async image => {
        return this.loadImage({ image, timeout, onLoaded, onError });
      }),
    );
  }
}
