const Raven = require('raven')
const mandrill = require('mandrill-api/mandrill')
const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)

const sendWelcome = (firstName, lastName, email) => {
  const templateName = 'Welcome to Liberac'
  const templateContent = [{}]
  var message = {
    'subject': 'Welcome',
    'from_email': 'welcome@liberac.co.nz',
    'from_name': 'The Liberac team',
    'to': [{
      'email': email,
      'name': `${firstName} ${lastName}`,
      'type': 'to'
    }],
    'headers': {
      'Reply-To': 'noreply@liberac.co.nz'
    },
    'important': false,
    'track_opens': true,
    'track_clicks': true,
    'auto_text': true,
    'auto_html': null,
    'merge': true,
    'merge_language': 'mailchimp',
    'global_merge_vars': [{
      "name": "FIRSTNAME",
      "content": firstName
    }]
  }

  mandrillClient.messages.sendTemplate({
    'template_name': templateName,
    'template_content': templateContent,
    'message': message,
  }, (res) => {
    console.log(res)
  }, (err) => {
    Raven.captureException(err, {
      user: {
        name: `${firstName} ${lastName}`,
        email: email
      }
    })
    console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message)
  })
}

const notifyTeam = (name, email) => {
  var message = {
    "text": `New User: ${name} <${email}>`,
    "subject": `${name} is now onboard`,
    "from_email": "usersignups@liberac.co.nz",
    "from_name": "User Signups",
    "to": [{
            "email": "contact@liberac.co.nz",
            "name": "Liberac",
            "type": "to"
        }]
  }

  mandrillClient.messages.send({ "message": message }, (res) => {}, (err) => {
    Raven.captureException(err, {
      user: {
        name: name,
        email: email
      }
    })
    console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
  });
}

module.exports = { 
  sendWelcome,
  notifyTeam
}
