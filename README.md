# Knowledgebase
Our app will be a Social trivia app that will have categories of multiple choice questions.<br />
More details will be provided [here](https://github.com/SCCapstone/Knowledgebase/wiki/Project-Description)

## External Requirements

In order to build this project you first have to install:

* [Node.js](https://nodejs.org/en/download/) <br/>

* Follow these instructions for [MacOS](https://treehouse.github.io/installation-guides/mac/node-mac.html) <br/>

* Follow these instructions for [Windows](https://treehouse.github.io/installation-guides/windows/node-windows.html) <br/>

## Setup

After you have installed the components required above:
* Using terminal, clone the repo on your device ```git clone https://github.com/SCCapstone/Knowledgebase.git```
* cd into the main repo folder and run ```npm install``` (you may need to do sudo)

## Running

### Browser
* To run on your browser, simply do in the main folder of the repo: ```ionic serve```

### iOS
To run on iOS: {You will need to have Xcode}
  * ```ionic build```
  * ```ionic cap add ios```
  * ```ionic cap open ios```
  * Then it will open Xcode. Choose App -> Signing & Capabilities -> Team (Add your account if you don't have one).
  * After that select iOS Simulator or your phone if you have connected.<br />
    <img width="176" alt="iOS-1" src="https://user-images.githubusercontent.com/45217514/113521038-f1be9780-9564-11eb-8b8c-fd886f7f58cc.png">
  * Then Click play button.<br />
    <img width="101" alt="iOS-2" src="https://user-images.githubusercontent.com/45217514/113521043-fd11c300-9564-11eb-962c-2adfd6b1065f.png">

  * If you decide to run on phone then you may have to go to (settings -> General -> Device Management) after above steps.<br />Make sure dark mode is off on your device.

### Android

To run on Android: {You will need to have Android Studio}
* Open up Android Studio and click on "Configure" on the bottom right.
* Choose AVD Manager
* Here you will see a list of your virtual devices, open up any device you would like.
 * If you do not have any devices, you can follow this tutorial to create one [here](https://developer.android.com/studio/run/managing-avds)
* After you have your device open, simply run ```ionic cap run android -l --external```

# Testing

## Unit Testing
  
* After you have cloned this repository, go into the Knowledgebase directory and run 
```npm install``` or ```sudo npm install``` command in the terminal.
* After it has completed installing the packages, run ```npm run test``` command. 
* You will be shown an interface like this, simply press ```a``` to run all of the tests.

![ ](https://user-images.githubusercontent.com/45472641/107119995-edbe1400-6858-11eb-8e2d-26f146275af6.png)

* This command will run each test one by one until all tests are done running.
* The directory of all test files are [here](https://github.com/SCCapstone/Knowledgebase/tree/master/src/tests) <br/>

## E2E Testing
For the behavioral testing part of testing, we decided to go with an e2e testing technique. E2E testing runs through all of the core features / functions of our app and tests if they are all working as they should. We are using a library called Cypress to achieve this.

* Start by starting up an instance of the app on your local host by doing ```ionic serve``` in the main folder.
* Now, open a new terminal and navigate to the repo and run ```npx cypress open```
* This will open a seperate window with the cypress menu. Click on 'test.spec.js' to begin the testing.
* As soon as you click on the file, an instance of chromium will open in which you will see the program running through the app and testing all of the features and functions as if a normal user would.

A video of showing how the E2E testing looks:
https://user-images.githubusercontent.com/45472641/115975221-e68dd480-a530-11eb-872a-c1aad95e5fcd.mov


# Testing Technology

* For the Unit testing, we used the built in libraries that come with Ionic which are Jest and React Testing library. More information on those [here](https://ionicframework.com/blog/testing-ionic-react-apps-with-jest-and-react-testing-library/)

* For the E2E Testing, we used a library called Cypress. Cypress also has integration with Ionic and works very well and is easy to understand. More information on Cypress [here](https://www.cypress.io/blog/2020/07/08/end-to-end-testing-mobile-apps-with-ionic-and-cypress/)


# Authors
* Mayank Patel  - mayank@email.sc.edu <br/>
* Rutvik Patel  - rdpatel@email.sc.edu <br/>
* Ravi Patel    - rhp@email.sc.edu <br/>
* Anand Patel   - anandp@email.sc.edu <br/>
* George Pegues - gpegues@email.sc.edu <br/>
