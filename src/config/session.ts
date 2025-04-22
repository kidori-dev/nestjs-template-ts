import { INestApplication } from '@nestjs/common';
import session from 'express-session';
import { createClient } from 'redis';
import passport from 'passport';
import RedisStore from 'connect-redis';
import * as process from 'node:process';

export function initSession(app: INestApplication): void {
  // const RedisStore = require('connect-redis').default;
  const appName = process.env.APP_NAME ?? 'API';
  const sessionMaxAge = process.env.AUTH_SESSION_MAX_AGE ?? 3600;

  const redisClient = createClient({
    url: process.env.WORKER_HOST ?? '127.0.0.1:6379',
  });
  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: `${appName}:`,
  });

  const apiPrefix = process.env.API_PREFIX ?? 'api';
  const apiVersion = 'v1';
  const defaultPath = `/${apiPrefix}/${apiVersion}`;

  app.use(
    `${defaultPath}/user`,
    session({
      name: `user.sid`,
      store: redisStore,
      resave: false, //모든 request 마다 기존에 있던 session에 아무런 변경사항이 없을 시에도 그 session 을 다시 저장. 대체로 false 로 함
      saveUninitialized: false, // request 에 session 값이 없으면 초기화 작업을 할 것인가  , 공식 레퍼런스 false , 로그인할떄만
      secret: appName, // 세션 id 쿠키에 서명 할 때 사용
      cookie: {
        // secure: process.env.NODE_ENV === 'production', // https 환경에서만 session 정보를 주고받도록 처리
        secure: false,
        httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
        maxAge: Number(sessionMaxAge) * 1000, // 세션 유지시간
      },
    }),
  );

  app.use(
    `${defaultPath}/admin`,
    session({
      name: `admin.sid`,
      store: redisStore,
      secret: appName,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: Number(sessionMaxAge) * 1000,
      },
    }),
  );

  app.use(`${defaultPath}/user`, passport.initialize(), passport.session());
  app.use(`${defaultPath}/admin`, passport.initialize(), passport.session());
}
