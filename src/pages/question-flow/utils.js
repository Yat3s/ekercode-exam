import { QuestionType } from './constants';

export function extractImages(data) {
  switch (data.type) {
    case QuestionType.SINGLE_CHOICE:
      return [...data.question.images, ...data.choices.map(c => c.image)];
    case QuestionType.ESSAY:
      return [...data.question.images];
    default:
      return [];
  }
}
