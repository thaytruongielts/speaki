
import { IeltsQuestion } from './types';

const questions: IeltsQuestion[] = [
  // Part 1
  { part: 'Part 1', question: 'Do you like to watch movies?' },
  { part: 'Part 1', question: 'What kind of music do you listen to?' },
  { part: 'Part 1', question: 'Tell me about your hometown.' },
  { part: 'Part 1', question: 'Do you work or are you a student?' },
  { part: 'Part 1', question: 'What do you do in your free time?' },
  { part: 'Part 1', question: 'Do you enjoy cooking? Why or why not?' },
  { part: 'Part 1', question: 'Are you a morning person or a night owl?' },
  { part: 'Part 1', question: 'What is your favorite color and why?' },
  
  // Part 3
  { part: 'Part 3', question: 'How has technology changed the way people communicate with each other?' },
  { part: 'Part 3', question: 'What are the advantages and disadvantages of online shopping?' },
  { part: 'Part 3', question: 'In your opinion, should governments invest more in public transportation?' },
  { part: 'Part 3', question: 'What role does advertising play in society today?' },
  { part: 'Part 3', question: 'How important is it for people to travel to other countries?' },
  { part: 'Part 3', question: 'Do you think traditional skills are still important in the modern world?' },
  { part: 'Part 3', question: 'What can be done to reduce environmental pollution in big cities?' },
  { part: 'Part 3', question: 'Is it better for children to grow up in the city or in the countryside?' },
];

export const getRandomQuestion = (): IeltsQuestion => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};
