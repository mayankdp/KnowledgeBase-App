import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonImg,
  IonButton,
  CreateAnimation,
  IonItem,
  IonText,
  IonAlert,
  IonHeader,
  IonFooter,
  IonRow,
  IonCol
} from "@ionic/react";
import { useHistory } from "react-router";
import { firebase } from "../../Firebase/firebaseConfig";
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

const INITIAL_STATE = {
  notifications: [{ id: 'id', title: 'Test Push', body: "This is my first push notification" }],
};

const Trivia: React.FC = () => {
  const emptyarr: any = [];
  const [notificationState, setNotificationState] = useState(emptyarr);

  const history = useHistory();
  const db = firebase.firestore();
  var storageRef = firebase.storage().ref();
  var currUser = firebase.auth().currentUser?.uid;

  const [img, setImg] = useState(true);
  const [inf, setInf] = useState(100);

  const [aalert, setAlert] = useState(false);

  useEffect(() => {
    db.collection("users").doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        setAlert(data.alertMsg);
      }
    })

    // PushNotifications.register();

    // PushNotifications.addListener('registration',
    //   (token: PushNotificationToken) => {
    //     db.collection("id").add({ id: token.value });
    //   }
    // );

    // PushNotifications.addListener('registrationError',
    //   (error: any) => {
    //     console.log(error)
    //   }
    // );

    // PushNotifications.addListener('pushNotificationReceived',
    //   (notification: PushNotification) => {
    //     let notif = [];
    //     notif.push({ id: notification.id, title: notification.title, body: notification.body })
    //     setNotificationState(notif)
    //   }
    // );

    // PushNotifications.addListener('pushNotificationActionPerformed',
    //   (notification: PushNotificationActionPerformed) => {
    //     let notif = [];
    //     notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
    //     setNotificationState(notif)
    //   }
    // );
  }, []);

  function push() {
    PushNotifications.register();

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        db.collection("id").add({ id: token.value });
        alert('Push registration success, token: ' + token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        let notif = [];
        notif.push({ id: notification.id, title: notification.title, body: notification.body })

        setNotificationState(notif)
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        let notif = [];
        notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
        setNotificationState(notif)
      }
    );
  }

  async function Categories() {
    history.push('/Categories');
  }

  async function createTriviaPage() {
    history.push('/UserCreatePage')
  }

  async function goToPacks() {
    history.push('/Packs')
  }

  function imagePause() {
    setImg(!img);
    if (inf == 100) {
      setInf(0);
    } else {
      setInf(100);
    }
  }


  return (
    <IonPage>
      <IonContent class='ionContent' fullscreen>
        <IonAlert
          cssClass='alert'
          isOpen={aalert}
          header={'Welcome To Knowledgebase!'}
          message={'To answer curated questions, go to Answer Trivia! To take a look at custom packs, go to Knowledge Packs!'}
          buttons={[
            {
              text: 'Got it!',
              handler: () => {
                db.collection("users").doc(currUser).update({
                  alertMsg: false
                })
              }
            }
          ]}
        />
        <CreateAnimation
          duration={3000}
          keyframes={[
            { offset: 0, transform: 'scale(1)', opacity: '1' },
            { offset: 0.5, transform: 'scale(1.2)', opacity: '0.3' },
            { offset: 1, transform: 'scale(1)', opacity: '1' }
          ]}
          easing="ease-out"
          iterations={inf}
          play={img}
        >
          <IonImg class="logo" src={"../assets/K-bulb.png"} onClick={() => imagePause()} />
        </CreateAnimation>

        <IonItem lines="none">
          <IonCol>
            <IonRow>
              <IonText class='homeText'>
                Knowledgebase
          </IonText>
            </IonRow>
            <IonRow>
              <IonText class='homeText1'>
                where you test your knowledge
          </IonText>
            </IonRow>
          </IonCol>
        </IonItem>

        <IonItem lines="none">
          <IonButton id="answer" style={{ marginBottom: 40, marginTop: "4rem" }} color="tertiary" size="large" class="homeButtons" onClick={Categories}> Answer Trivia </IonButton>
        </IonItem>

        <IonItem lines="none">
          <IonButton id="packs" color="tertiary" size="large" class="homeButtons" onClick={goToPacks}> Knowledge Packs </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Trivia;