export function extractImages(data) {
  const images = [...data.question.images, ...data.choices.map(c => c.image)];
  return images;
}
