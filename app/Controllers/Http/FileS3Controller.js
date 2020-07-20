'use strict'

const Drive = use('Drive')
const Upload = use('App/Models/FileS3')

class FileS3Controller {
  async index ({ request, response, view }) {
  }

  async store ({ request, response }) {
    await request.multipart
      .file('image', {}, async file => {
        try {
          const ContentType = file.headers['content-type']
          const ACL = 'public-read'
          const Key = `${(Math.random() * 100).toString(32)}-${file.clientName}`

          console.log(ContentType, ACL, Key)

          const url = await Drive.put(Key, file.stream, {
            ContentType,
            ACL
          })

          console.log(url)

          await Upload.create({
            name: file.clientName,
            key: Key,
            url,
            content_type: ContentType
          })
        } catch (err) {
          return response.status(err.status).json({
            error: {
              message: 'Não foi possível enviar o arquivo!',
              err_message: err.message
            }
          })
        }
      })
      .process()
  }

  async show ({ params, request, response, view }) {
    const { id: name } = params

    try {
      const file = await Upload.findByOrFail('name', name)

      response.implicitEnd = false
      response.header('Content-Type', file.content_type)

      const stream = await Drive.getStream(file.key)

      stream.pipe(response.response)
    } catch (err) {
      return response.status(err.status).json({
        error: {
          message: 'Arquivo não existe!',
          err_message: err.message
        }
      })
    }
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
    const { id: name } = params

    try {
      const file = await Upload.findByOrFail('name', name)

      await Drive.delete(file.key)

      await file.delete()
    } catch (err) {
      return response.status(err.status).json({
        error: {
          message: 'Arquivo não existe e não pôde ser removido.',
          err_message: err.message
        }
      })
    }
  }
}

module.exports = FileS3Controller
