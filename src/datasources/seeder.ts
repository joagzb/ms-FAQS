import axios from 'axios';
import {DataSource} from 'typeorm';
import {QuestionDTO} from '../api/question/questionDTO.model';
import Configuration from '../config/config';

/**
  @description install all necessary postgres extensions
*/
export const installExtensions = async (dataSource: DataSource, schema?: string) => {
  // GIN and GiST tree indexing
  const ginExtensionQuery = `CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA ${schema ?? 'public'}`;
  await dataSource.query(ginExtensionQuery);

  // trigrams
  const trigramsExtensionQuery = `CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA ${schema ?? 'public'}`;
  await dataSource.query(trigramsExtensionQuery);
};

/**
  @description preload DB with ready-to-test fake data
*/
export const preloadDB = async (): Promise<any> => {
  const ServerConfiguration = Configuration.getConfig().server;
  const endpoint = `http://${ServerConfiguration.HOST}:${ServerConfiguration.PORT}${ServerConfiguration.GLOBAL_URL_PREFIX}/questions`;

  // fake default data
  const questions: QuestionDTO[] = [
    {
      text: 'What is the most fuel-efficient car on the market?',
      answer: 'The Toyota Prius',
    },
    {
      text: 'What is the most reliable bike brand?',
      answer: 'Honda',
    },
    {
      text: 'What is the most luxurious car brand?',
      answer: 'Rolls-Royce',
    },
    {
      text: 'What is the best electric car for long distances?',
      answer: 'The Tesla Model S',
    },
    {
      text: 'What is the most powerful production car?',
      answer: 'The Bugatti Chiron Super Sport 300+',
    },
    {
      text: "What is the car's fuel efficiency rating?",
      answer: 'The fuel efficiency rating is determined by the Environmental Protection Agency (EPA) and is measured in miles per gallon (mpg).',
    },
    {
      text: 'Does the car have any safety features?',
      answer: 'Yes, the car may have safety features such as airbags, anti-lock brakes (ABS), electronic stability control (ESC), backup cameras, and blind-spot monitoring.',
    },
    {
      text: "What is the car's safety rating?",
      answer:
        'The National Highway Traffic Safety Administration (NHTSA) and the Insurance Institute for Highway Safety (IIHS) both conduct safety tests on vehicles and provide safety ratings.',
    },
    {
      text: 'Does the car have a warranty?',
      answer: 'Many new cars come with a warranty that covers the cost of repairs for a certain period of time or mileage. Check with the dealer or manufacturer for details.',
    },
    {
      text: "What is the car's resale value?",
      answer: 'The resale value is the amount of money the car is expected to be worth in the future. This can vary depending on the make, model, and condition of the car.',
    },
    {
      text: "What is the car's maintenance schedule?",
      answer: 'The maintenance schedule outlines when the car should be serviced and what type of service is required. This can help ensure the car runs smoothly and prevent breakdowns.',
    },
    {
      text: "What is the car's towing capacity?",
      answer: "The towing capacity is the maximum weight the car can tow safely. Check the owner's manual or with the dealer for more information.",
    },
    {
      text: "What is the car's maximum payload capacity?",
      answer:
        "The maximum payload capacity is the weight the car can carry in addition to the weight of the driver and passengers. Check the owner's manual or with the dealer for more information.",
    },
    {
      text: 'Does the car have a sunroof?',
      answer: 'Some cars have a sunroof, which is a panel in the roof that can be opened to let in sunlight or fresh air.',
    },
    {
      text: "What is the car's horsepower?",
      answer: "Horsepower is a measure of the car's engine power. The higher the horsepower, the faster the car can go.",
    },
    {
      text: "What is the car's top speed?",
      answer: 'The top speed is the maximum speed the car can reach. This can vary depending on the make, model, and engine.',
    },
    {
      text: "What is the car's acceleration time?",
      answer: "The acceleration time is the time it takes for the car to reach a certain speed, such as 0 to 60 miles per hour. This can give an idea of the car's performance.",
    },
    {
      text: 'Does the car have a navigation system?',
      answer: 'Some cars have a built-in navigation system that can help drivers find their way. Other cars may require a separate GPS device or smartphone app.',
    },
    {
      text: "What is the car's audio system like?",
      answer: 'The audio system can vary depending on the make and model of the car. Some cars have high-end audio systems with features like surround sound and satellite radio.',
    },
  ];

  try {
    for (const question of questions) {
      const response = await axios.post(endpoint, question);
    }
  } catch (error) {
    throw new Error(`Error inserting fake data. ${error instanceof Error ? error.message : ''}`);
  }
};

/**
  @description create indexes on DB to speed-up searchs
*/
export const generateSearchIndex = async (dataSource: DataSource, table: string, schema?: string) => {
  const indexQuery = `
    CREATE INDEX IF NOT EXISTS idx_tsvector_message ON ${schema ? `${schema}.` : ''}"${table}" USING GIN(tags);
    `;

  await dataSource.query(indexQuery);
};
