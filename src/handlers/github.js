const {
  handleGithubVerify,
  handleGithubCheck,
} = require('../lib/github-verification')
const {
  parseGithubVerification,
  parseGithubCheck,
} = require('../parser/github')
const { dbHandler } = require('../utilities/db')

const { log } = require('../utils')

async function verifyGithub(message) {
  try {
    const [username] = parseGithubVerification(
      message.content,
      message.author.id,
    )
    if (username) {
      const response = await handleGithubVerify(message.author.id, username)
      message.author.send(response.message)
    }
  } catch (err) {
    log(err)
    message.reply(
      'Command parsing failed. Please use the !hny help command to see how to use the requested command properly.',
    )
  }
}

async function checkGithub(message) {
  try {
    const [verification_code, username] = parseGithubCheck(
      message.content,
      message.author.id,
    )
    if (verification_code && username) {
      const response = await handleGithubCheck(
        message.author.id,
        verification_code,
        username,
      )
      message.author.send(response.message)
      dbHandler(message, null, username, null)
    }
  } catch (err) {
    log(err)
    message.reply(
      'Command parsing failed. Please use the !hny help command to see how to use the requested command properly.',
    )
  }
}

module.exports = { verifyGithub, checkGithub }
