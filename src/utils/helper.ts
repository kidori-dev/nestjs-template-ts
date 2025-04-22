import cryptoJs from 'crypto-js';
import dayjs from 'dayjs';
import kleur from 'kleur';
import BigNumber from 'bignumber.js';
import slugify from 'slugify';

export const JsonArrayNullKeyClear = (list: any[]) => {
  for (const item of list) {
    const keyNames = Object.keys(item);
    for (const key of keyNames) {
      if (!item[key]) {
        delete item[key];
      }
    }
  }
  return list;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const arrDevision = (data: any[], size: number) => {
  const arr: any = [];
  for (let i = 0; i < data.length; i += size) {
    arr.push(data.slice(i, i + size));
  }
  return arr;
};

export const randomStr = (size: number = 4): string => {
  return cryptoJs.lib.WordArray.random(size).toString();
};

export const encryptSha256 = (item: any) => {
  return cryptoJs.SHA256(item).toString();
};

export const customLog = (message: any, level: 'info' | 'error' | 'warning' = 'info') => {
  const time = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`;

  if (!message) {
    console.log(kleur.bold().red(`${time} ${level.toUpperCase()}: 잘못된 커스텀 로그 사용 (message===null)`));
  }
  if (typeof message === 'object') {
    return console.log(message);
  }

  switch (level) {
    case 'info':
      console.log(kleur.bold().green(`${time} ${level.toUpperCase()}: ${message}`));
      break;
    case 'warning':
      console.log(kleur.bold().yellow(`${time} ${level.toUpperCase()}: ${message}`));
      break;
    case 'error':
      console.log(kleur.bold().red(`${time} ${level.toUpperCase()}: ${message}`));
      break;
    default:
      console.log(`${message}`);
      break;
  }
};

export const smartFormat = (param: BigNumber | string | number, precision: number = 2) => {
  // 소수점이 없으면 그냥 정수로 표시하고, 있으면 소수점 precision 자리까지 표시
  const value = BigNumber.isBigNumber(param) ? param : new BigNumber(param);
  if (value.decimalPlaces() === 0) {
    return value.toFormat(0); // 소수점 없이 정수로 표시
  } else {
    return value.toFormat(precision); // 소수점 precision 자리까지 표시
  }
};

export const getSlug = (title: string) => {
  const slug: string = slugify(title, {
    lower: true, // 소문자로 변환
    strict: true, // 특수 문자 제거
    replacement: '-', // 공백을 하이픈으로 대체
  });
  return `${slug}-${randomStr(4)}`;
};

export const getTimestamp = () => {
  return dayjs().unix();
};
