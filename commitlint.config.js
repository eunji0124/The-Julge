module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?<emoji>.*?)\s*(?<type>\w+):\s*(?<subject>.+)$/,
      headerCorrespondence: ['emoji', 'type', 'subject'],
    },
  },
  rules: {
    'type-case': [0],
    'subject-case': [0],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'Init', // 프로젝트 초기 설정 및 최초 커밋
        'Feat', // 새로운 기능 추가
        'Chore', // 설정, 빌드, 패키지, 기타 유지보수 작업
        'Fix', // 버그 수정
        'Style', // 스타일 변경 (UI 수정, 코드 정렬, 파일/폴더 구조 변경 등)
        'Refactor', // 코드 리팩토링 (기능 변경 없이 코드 개선)
        'Docs', // 문서 수정 (README, 주석 등)
        'Remove', // 불필요한 코드, 파일 삭제
        'Revert', // 이전 커밋 되돌리기
      ],
    ],
  },
};
