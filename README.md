# ngx-mydatepicker-th

**Angular Directive date picker**

[![Build Status](https://travis-ci.org/ronsc/ngx-mydatepicker-th.svg?branch=master)](https://travis-ci.org/ronsc/ngx-mydatepicker-th)
[![npm](https://img.shields.io/npm/v/ngx-mydatepicker.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/ngx-mydatepicker-th)

## Description

This Project is Fork From [ngx-mydatepicker](https://github.com/kekeh/ngx-mydatepicker) 
Custom For Support Thai Year.

Thx. [@kekeh](https://github.com/kekeh) for great component.

## Installation

To install this component to an external project, follow the procedure:

1. __npm install ngx-mydatepicker-th --save__

2. Add __NgxMyDPTHModule__ import to your __@NgModule__ like example below
    ```ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { NgxMyDPTHModule } from 'ngx-mydatepicker-th';

    @NgModule({
        imports:      [ BrowserModule, NgxMyDPTHModule ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```

3. If you are using __systemjs__ package loader add the following ngx-mydatepicker-th properties to the __System.config__:
    ```js
    (function (global) {
        System.config({
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                // Other components are here...

                'ngx-mydatepicker-th': 'npm:ngx-mydatepicker-th/bundles/ngx-mydatepicker-th.umd.min.js'
            },
            packages: {
            }
        });
    })(this);
    ```
    
## Usage

See from Original Repo [Click](https://github.com/kekeh/ngx-mydatepicker#usage)

## Attributes

See from Original Repo [Click](https://github.com/kekeh/ngx-mydatepicker#attributes)

### custom attribute

| Option         | Default        | Type | Description |
| :------------- | :------------- | :----| :---------- |
| __yearOffset__     | 543 | number | For Display Year with by plus offset value Ex. A.D. Year 2017 Will Display is 2560 (2017 + 543). |

* Example of the options data (not all properties listed):
```ts
  myOptions: INgxMyDpOptions = {
      yearOffset: 543
  };
```

## Functions

See from Original Repo [Link](https://github.com/kekeh/ngx-mydatepicker#functions)

## Callbacks

See from Original Repo [Link](https://github.com/kekeh/ngx-mydatepicker#callbacks)

## Development of this component

* At first fork and clone this repo.

* Install all dependencies:
  1. __npm install__
  2. __npm install --global gulp-cli__

* Build the __npmdist__ folder and execute __tslint__:
  1. __gulp all__

* Execute unit tests and coverage (output is generated to the __test-output__ folder):
  1. __npm test__

* Run sample application:
  1. __npm start__
  2. Open __http://localhost:5000__ to browser

* Build a local npm installation package:
  1. __gulp all__
  2. __cd npmdist__
  3. __npm pack__
    * local installation package is created to the __npmdist__ folder. For example: __ngx-mydatepicker-0.0.1.tgz__

* Install local npm package to your project:
  1. __npm install path_to_npmdist/ngx-mydatepicker-0.0.1.tgz__

## Compatibility (tested with)
* Firefox (latest)
* Chrome (latest)
* Chromium (latest)
* Edge
* IE11
* Safari

## License
* License: MIT

## Author
* Author: kekeh (Original)
* Author: ronsc (Fork)

## Keywords
* Date picker
* Angular2
* Angular4
* date picker thai
