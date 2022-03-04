import { Injectable } from '@nestjs/common';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  readJson(filePath: string) {
    try {
      const rawData = fs.readFileSync(filePath);
      return JSON.parse(rawData.toString());
    } catch (error) {
      console.log(error.message);
    }
  }

  readYml(filePath: string) {
    try {
      return yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.log(error.message);
    }
  }
}
