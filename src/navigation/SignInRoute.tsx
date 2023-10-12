import React from "react";
import { Redirect, Route } from 'react-router-dom';
import {
  IonImg,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import '../theme/variables.css';

//Three main tabs
import Tab1 from "../pages/Tabs/Profile";
import Tab2 from "../pages/Tabs/Trivia";
import Tab3 from "../pages/Tabs/Leaderboard";

//Triva pages
import UserAnswerTrivia from "../pages/TriviaPage/UserAnswerTrivia";
import UserCreateTrivia from "../pages/TriviaPage/UserCreateTrivia";
import QuestionPage from "../pages/TriviaPage/QuestionPage";
import Categories from "../pages/TriviaPage/Categories";
import Packs from "../pages/TriviaPage/Packs";
import Create from "../pages/TriviaPage/Create";
import PackView from "../pages/TriviaPage/PackView";
import packQuestion from "../pages/TriviaPage/packQuestion";
import EditQuestion from "../pages/TriviaPage/EditQuestion";

//Setting page (upload image/ change username)
import Settings from "../pages/settings";

// User Info page
import User from "../pages/UserPage/user";

// Quick add user page
import quickAddUser from "../pages/UserPage/quickAddUser";

// Chat Page 
import Chat from "../pages/Chat/chatPage";
import ChatUser from "../pages/Chat/chatUser";
import '../pages/Chat/chat.css';

export default function SignInRoute() {

  return (
    <IonReactRouter>
      <IonRouterOutlet class="tabs">
        <Route path="/UserAnswerPage" component={UserAnswerTrivia} />
        <Route path="/QuestionPage" component={QuestionPage} />
        <Route path="/UserCreatePage" component={UserCreateTrivia} />
        <Route path="/Categories" component={Categories} />
        <Route path="/Settings" component={Settings} />
        <Route path="/Packs" component={Packs} />
        <Route path="/User" component={User} />
        <Route path="/Create" component={Create} />
        <Route path="/PackView" component={PackView} />
        <Route path="/packQuestion" component={packQuestion} />
        <Route path="/EditQuestion" component={EditQuestion} />
        
        <Route path="/Chat" component={Chat} />
        <Route path="/ChatUser" component={ChatUser} />

        <Route path="/quickAddUser" component={quickAddUser} />

        <Route path="/tabs" render={() => (
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/tabs/tab1" component={Tab1} exact={true} />
              <Route path="/tabs/tab2" component={Tab2} exact={true} />
              <Route path="/tabs/tab3" component={Tab3} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom" class="tabbar">
              <IonTabButton class="tabText" tab="tab1" href="/tabs/tab1">
                <IonImg style={{ width: 25, height: 25 }} src={"../assets/profile.png"} />
                Profile
              </IonTabButton>

              <IonTabButton class="tabText" tab="tab2" href="/tabs/tab2">
                <IonImg style={{ width: 27, height: 27 }} src={"../assets/bulb.png"} />
                Home
              </IonTabButton>

              <IonTabButton class="tabText" tab="tab3" href="/tabs/tab3">
                <IonImg style={{ width: 27, height: 27 }} src={"../assets/leaderboard.png"} />
                Leaderboard
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )} />

        <Route path="" render={() => <Redirect to="/tabs/tab2" />} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  )
}
