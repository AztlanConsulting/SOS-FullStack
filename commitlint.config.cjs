module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^\[(ADD|FIX|UPDATE|MODIFY|DELETE|TEST|DOC|MERGE)\] (.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-empty': [2, 'never'],

    'type-enum': [
      2,
      'always',
      ['ADD', 'FIX', 'UPDATE', 'MODIFY', 'DELETE', 'TEST', 'DOC', 'MERGE'],
    ],

    'subject-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],

    'subject-case': [
      2,
      'never',
      ['upper-case'],
    ],
  },
};
