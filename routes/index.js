var location_methods = require('../lib/location_methods.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send(location_methods.get_locations('wood', location_methods.get_info_sheet, location_methods.get_greeenwaste_recyclers));
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
	console.log(req.body);
	console.log(req.body['Body']);
	var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
    
	/*console.log(req.body['SmsSid']);
    var callerId = req.body['SmsSid'];
    console.log(callerId);
    console.log(callerId.phoneNumber);

    client.outgoingCallerIds.create({
    friendlyName: "Mengmeng",
    phoneNumber: "+2498800325"
    friendlyName: req.body['From'],
    phoneNumber: req.body['From']
	}, function(error, callerId) {
	    process.stdout.write(callerId.sid);
	}); */
// Use this convenient shorthand to send an SMS:
	client.sendSms({
		    to: req.body['From'],
		    from:'+19513833688',
		    body: req.body['Body']
		}, function(error, message) {
		    if (!error) {
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		        console.log('Message sent on:');
		        console.log(message.dateCreated);
		    } else {
		        console.log('Oops! There was an error.');
		    }
		}
	);

}

