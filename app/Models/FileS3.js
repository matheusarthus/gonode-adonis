'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FileS3 extends Model {
  static get table () {
    return 'file_s3'
  }
}

module.exports = FileS3
