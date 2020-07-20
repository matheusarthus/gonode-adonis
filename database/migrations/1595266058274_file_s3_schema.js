'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileS3Schema extends Schema {
  up () {
    this.create('file_s3', (table) => {
      table.increments()
      table.string('name')
      table.string('key')
      table.string('url')
      table.string('content_type')
      table.timestamps()
    })
  }

  down () {
    this.drop('file_s3')
  }
}

module.exports = FileS3Schema
