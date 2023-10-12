import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonPage,
  IonRow,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { firebase } from '../Firebase/firebaseConfig'
import './Home.css';
import './Tabs/Styles.css';
import { Toast } from "../components/toast"

const ForgetPassword: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");

  function validateEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function resetPassword() {
    if (validateEmail()) {
      firebase.auth().sendPasswordResetEmail(email);
      Toast("An email has been sent if it was registered!")
    } else {
      Toast("Please enter a valid email!")
    }
  }

  return (
    <IonPage>
      <IonContent className='ion-padding' class='ionContent'>
        <IonImg class="logo" src={"../assets/K-bulb.png"} />
        <IonGrid>
          <IonRow>
            <IonText class="botText">Please enter your email to change your password</IonText>
          </IonRow>
        </IonGrid>
        <IonInput
          class="loginInput"
          placeholder="Email"
          onIonChange={(e: any) => setEmail(e.target.value)}
        />
        <IonButton onClick={resetPassword}>Send Email</IonButton>
        <p>
          <IonText class="link" onClick={() => history.push("login")}>Login</IonText>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default ForgetPassword;
