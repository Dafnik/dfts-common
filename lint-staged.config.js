module.exports = {
  '{apps,libs,tools}/**/*.{ts,js,json,md,html,css,scss}': [
    'nx affected --target lint --fix true --uncommitted',
    //'nx affected --target test --uncommited',
    'nx format:write --uncommitted',
  ],
};
