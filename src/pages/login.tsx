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
import { firebase } from '../Firebase/firebaseConfig'
import './Home.css';
import './Tabs/Styles.css';
import { Toast } from "../components/toast"
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        if (response.user) {
          const uid = response.user.uid;
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(uid)
            .get()
            .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                Toast("User does not exist anymore.");
                // alert("User does not exist anymore.");
                return;
              }
              // history.push("/tabs/tab2")
              // const user = firestoreDocument.data();
            })
            .catch((error) => {
              Toast(error);
              // alert(error);
            });
        }
      })
      .catch((error) => {
        Toast(error);
        // alert(error);
      });
  }

  return (
    <IonPage>
      <IonContent className='ion-padding' class='ionContent'>
        <IonImg class="logo" src={"../assets/K-bulb.png"} />
        <IonGrid>
          <IonRow>
            <IonText class="botText">Enter your email and password to login</IonText>
          </IonRow>
        </IonGrid>
        <IonInput
          id="email"
          title="email text"
          class="loginInput"
          placeholder="Email"
          type="email"
          onIonChange={(e: any) => setEmail(e.target.value)}
        />
        <IonInput
          id="password"
          title="password text"
          class="loginInput"
          type="password"
          placeholder="Password"
          onIonChange={(e: any) => setPassword(e.target.value)}
        />
        <IonButton title="login" onClick={login}>Sign in</IonButton>
        {/* <IonItem>
          <IonIcon ios="ios-eye" md="md-eye" class="passwordIcon" onClick={() => console.log("Hello")}></IonIcon>
        </IonItem> */}
        <p>
          Create new Account? <IonText class="link" onClick={() => history.push("signup")}>Register</IonText>
        </p>
        <p>
          {/* <Link to="/ForgetPassword" >Forget Password</Link> */}
          <IonText class="link" onClick={() => history.push("ForgetPassword")}>Forget Password</IonText>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Login;
