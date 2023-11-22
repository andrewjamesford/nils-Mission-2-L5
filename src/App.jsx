import "./App.css";
import { useState } from "react";

//When setting up your Azure service, make sure you are using "Computer Vision" and you set the server to EAST US
//Otherwise you may run into restrictions on which services you can access
//Your endpint URL should include "cognitiveservices" and look like the below, if not, you setup the wrong model for this
//https://<PROJECT-NAME>.cognitiveservices.azure.com/

// Define our variables for Azure access - PLEASE USE DOTENV FOR REAL BUILD THIS IS AN EXAMPLE
// To make things easier, you can insert your variables between the "" here
// const ApiKey = "3a3fecf62e774b07b4401abc2fc617bb";
// const AzureEndpoint = "https://thevenardmission2.cognitiveservices.azure.com/";

//what's dotenv? it is built into the latest react builds but you used to need to install it with "npm i dotenv" or "npm i react-dotenv"
//dotenv is an environment that can store sensitive data like API keys you don't want accessed by the public
//a .env will stay on your local system and not get uploaded to github
//If you are anxious about whether it will get pushed to your repo, you can add *.env to your .gitignore file
//(I do just to be sure as some packges operate in different ways, better safe than sorry)
//If you expose your API keys some services will notice this and void them immediatly and you will need to make new ones.

//As an example, in React it will look similar to the below, but other package builders may access it differently such as VITE.
//Try commenting out the variable lines above and uncomment the below ones to see how it works
//You will need to add your variables to the .env file in the left menu but do not do anything else here except uncomment below

const ApiKey = process.env.REACT_APP_MY_APIKEY;
const AzureEndpoint = process.env.REACT_APP_MY_ENDPOINT;

console.log(ApiKey);
console.log(AzureEndpoint);

export default function App() {
  //in React we use "hooks" like setState to define the state of changing variables.
  //We can leave the variable empty or we can define it an initial value
  //here, we leave data empty because we haven't retrieved it yet, but we will define the html <input value={image} />
  const [data, setData] = useState();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(
    "https://www.toyota.co.nz/globalassets/new-vehicles/camry/2021/camry-zr-axhzr-nm1-axrzr-nm1/clear-cuts/updated-clear-cuts/camry-zr-eclipse.png"
  );

  //When the user enters something into the input field, we will monitor this and update the "image" variable using setImage
  const handleOnChange = (e) => {
    setImage(e.target.value);
  };

  //when the user clicks the button, we will initiate our call to the API
  //once the data has been fetched, it will setData with the data useState
  const onButtonClick = async (e) => {
    //preventDefault stops the button from acting like a default button (e.g. submitting a form) as we are using it asynchronously
    e.preventDefault();
    console.log("Click registered and ready to fetch!");
    try {
      //Now we will use a const to define the parameters for accessing the API including the APIKey and image url we stored using setImage
      const fetchOptions = {
        method: "POST",
        timeout: 50000,
        headers: {
          "Ocp-Apim-Subscription-Key": ApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: image,
        }),
      };
      //here we will use fetch to send all our data to the API and store it as "response"
      //We are combining our AzureEndpoint url to make it longer, notice at the end of the url, we define "tags,caption"
      //this url outlines what data we are requesting to be sent back, you can add more such as "denseCaptions"
      //check the Azure Analyze API documentation for the options
      const response = await fetch(
        `${AzureEndpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,caption`,
        fetchOptions
      );
      //we need to parse the data with the .json() so we can do something with it
      const parsedData = await response.json();
      //setData so we can now call the parsedData as a variable called 'data' as defined in setData useState
      setData(parsedData);
      //by checking the console we can see the raw json data and structure and confirm we got a response
      //this is also good to reference and make it easier when writing the html to display it,
      //but we should remove it and ideally use better tools to view it after confirming operation as we could forget to remove it
      console.log(parsedData);
      setCaption(parsedData.description.captions[0].text);
    } catch (error) {
      console.error("There is an error during fetch:", error);
    }
  };

  return (
    <div className="App">
      <h1>{caption}</h1>
      <div className="inputs">
        <input
          className="Input"
          placeholder="Enter image URL"
          onChange={handleOnChange}
          value={image}
        />
        <button className="Button" onClick={onButtonClick}>
          Run Service
        </button>
      </div>
      <p>
        I hope the comments make sense, but let me know if I need to explain
        more of what's in there, I stripped it down to try and make it more
        simple so there's no error handling other than any errors Azure would
        return.
      </p>
      <p>
        I've included explanations for useState functions for react incase
        anyone is unfamiliar with react hooks, but I would recommend looking
        into react hooks "useState" and "useEffect" as the most common ones if
        you plan to use react. I've added a second page called AppNoComments.js
        which has less comments if needed.
      </p>
    </div>
  );
}
