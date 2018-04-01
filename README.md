# Link-Backend
## [Live](txtlink.org)
## [Frontend Repo](https://github.com/jeffreychuc/Link-Frontend)
Link is the hackathon winner of one of the hackathons hosted by [100Hacks](http://100hacks.net/).
This app helps the homeless demographic with SMS texting capabilities to find critical information such as the location of nearby shelters, soup kitchens, or clinics. If you or anyone is in need of this service, the number to text is (510) 999 6129. Exact directions to use the service can be found by texting the number above for an initial greeting or by looking at the steps provided in the live link above.
## Features
### Find information through Text
Users can text our toll free number and include what they are in need of and their current location. We'll return the names and address of the three nearest locations that match their query.

### Natural Language Processing
Utilizing Google's Natural Language API, we parse through users' texts to decipher their needs and location. We pass the result into Google's Places API to find nearby matches.

### Display Nearby Resources
Our app includes a lightweight website built in React/Redux. The site includes a google-map-react display of all shelters and soup kitchens in San Francisco.

## Technologies
* React
* Redux
* Express
* Node.js
* Twilio
* Google Natural Language API
* Google Places API
* google-map-react
