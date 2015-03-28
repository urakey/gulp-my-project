gulp-my-project
================================================================================

## Required

This plugin requires

* [gulp](https://github.com/gulpjs/gulp)
* [glue](http://glue.readthedocs.org/en/latest/)
* [bower](http://bower.io/)


mac

```
$ npm install -g gulp

$ npm install -g bower

$ brew install jpeg
$ brew install python
$ pip install glue
```

## Instration

```
$ git clone https://github.com/urakey/gulp-my-project.git
$ cd gulp-my-project
$ npm install
```

## Run with

#### Development mode

```
$ gulp
```

#### Production mode

```
$ gulp --env prod
```

## Others

#### Watch tasks

```
$ gulp watch
$ gulp watch:css
$ gulp watch:js
```

| Task                 | Run                                                   |
| -------------------- | ----------------------------------------------------- |
| watch                | `build`                                               |
| watch:css            | `build:css`                                           |
| watch:js             | `build:js`                                             |

#### Build tasks

```
$ gulp build
$ gulp build:css
$ gulp build:js
```

| Task                 | Run                                                   |
| -------------------- | ------------------------------------------------------|
| build                | `glue` `build:css` `build:js`                                |
| build:styleguide     | `sass` `kss` `autoprefixer` `format:css` `move:style` `clean` |
| build:css            | `sass` `autoprefixer` ( `format:css` `clean` ) |
| build:js             | `webpack` ( `uglify` )                                |

*In () , it is in production mode.*

## ToDo

* PC / SP にわけるとか

## Changelog

* 2015.03.17 gulp-kss 導入
* 2015.03.16 タスクの名前を変更
* 2015.03.16 bower と webpadk のところをアップデート
* 2015.03.15 最初の一歩
