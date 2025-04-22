import request from 'supertest';
import { ADMIN_PASSWORD, ADMIN_USERNAME, APP_URL } from './utils/constants';

describe('Auth (e2e)', () => {
  const app = `${APP_URL}/api-server/v1`;
  const agent = request.agent(app);

  it('로그인', () => {
    return agent.post('/auth/login').send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }).expect(200);
  });

  it('로그아웃', () => {
    return agent.get('/auth/logout').expect(200);
  });
});
