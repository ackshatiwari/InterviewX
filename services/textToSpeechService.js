import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const client = new textToSpeech.TextToSpeechClient();

export const synthesizeSpeech = async (text, outputFile = null) => {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'NEUTRAL',
        name: 'en-US-Neural2-C'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0,
        volumeGainDb: 0
      }
    };

    const [response] = await client.synthesizeSpeech(request);
    
    if (outputFile) {
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(outputFile, response.audioContent, 'binary');
      console.log(`Audio content written to file: ${outputFile}`);
      return outputFile;
    }
    
    return response.audioContent;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
};

export const synthesizeSpeechStream = async (text) => {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'NEUTRAL',
        name: 'en-US-Neural2-C'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0
      }
    };

    const [response] = await client.synthesizeSpeech(request);
    return Buffer.from(response.audioContent).toString('base64');
  } catch (error) {
    console.error('Error synthesizing speech stream:', error);
    throw error;
  }
};