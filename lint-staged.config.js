module.exports = {
  '{apps,libs,tools}/**/*.{ts,js,json,md,html,css,scss}': [
    'nx affected --target lint --uncommitted --fix true',
    //'nx affected --target test --uncommited',
    'nx format:write --uncommitted',
  ],
};
