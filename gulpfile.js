/* eslint-disable no-console */
const gulp = require('gulp');
const release = require('gulp-github-release');
const fs = require('fs');
const run = require('gulp-run');
const dateTime = require('node-datetime');

const dt = dateTime.create();
const today = dt.format('Y-m-d');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const releaseFilename = `${packageJson.name}-v${packageJson.version}.kpz`;

const pmFile = 'EventManagement.pm';
const pmFilePath = 'Koha/Plugin/Com/LMSCloud/';
// const pmFilePathFull = pmFilePath + pmFile;
const pmFilePathDist = `dist/${pmFilePath}`;
const pmFilePathFullDist = pmFilePathDist + pmFile;

console.log(releaseFilename);
console.log(pmFilePathFullDist);

gulp.task(
  'build',
  () => new Promise((resolve) => {
    run(`
      mkdir dist ;
      cp -r Koha dist/. ;
      gsed -i -e "s/{VERSION}/${packageJson.version}/g" ${pmFilePathFullDist} ;
      gsed -i -e "s/1900-01-01/${today}/g" ${pmFilePathFullDist} ;
      cd dist ;
      zip -r ../${releaseFilename} ./Koha ;
      cd .. ;
      rm -rf dist ;
    `).exec();
    resolve();
  }),
);

gulp.task('release', () => {
  gulp.src(releaseFilename).pipe(
    release({
      // eslint-disable-next-line global-require
      manifest: require('./package.json'), // package.json from which default values will be extracted if they're missing
    }),
  );
});
