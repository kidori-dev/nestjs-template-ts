module.exports = {
  apps: [
    {
      name: '[port:3701] sales_back',
      script: 'dist/main.js', // 빌드된 애플리케이션 파일 경로
      exec_mode: 'cluster', // 클러스터 모드로 실행
      instances: '1', // CPU 코어 수에 맞춰 인스턴스를 자동으로 생성
      env_file: '.env',
      autorestart: true,
    },
  ],
};
