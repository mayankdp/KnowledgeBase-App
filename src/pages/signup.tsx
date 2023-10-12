import { IonButton, IonContent, IonGrid, IonImg, IonInput, IonPage, IonRow, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { firebase } from "../Firebase/firebaseConfig";
import { Toast } from "../components/toast"


const Signup: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [bool, setBool] = useState(true);

  function signupUser() {
    // console.log(username);
    // console.log(email);
    if (password !== confirmPassword) {
      Toast("Passwords don't match.");
      return;
    }
    // db.onSnapshot(function (querySnapshot) {
    //   querySnapshot.forEach(function (doc) {
    //     var data = doc.data();
    //     if (username === data.username) {
    //       setBool(false);
    //     }
    // test
    //   });
    // });
    // if (bool) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        if (response.user) {
          const uid = response.user.uid;
          const data = {
            uid: uid,
            email: email,
            username: username,
            score: 0,
            url: "",
            alertMsg: true,
            friends: [],
            packs: [],
            invitedPacks: []
          };
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              Toast("Signup successfully.");
            })
            .catch((error) => {
              Toast(error);
            });
        }
      })
      .catch((error) => {
        Toast(error);
      });
    // }
    // else {
    //   Toast("Username already exists");
    // }
  };

  return (
    <IonPage>
      <IonContent className='ion-padding' class='ionContent'>
        <IonImg class="logo" src={"../assets/K-bulb.png"} />
        <IonGrid>
          <IonRow>
            <IonText class="botText">Enter email and password to get started</IonText>
          </IonRow>
        </IonGrid>
        <IonInput
          title="username text"
          class="loginInput"
          type="text"
          placeholder="Username"
          maxlength={20}
          onIonChange={(e: any) =>
            setUsername(e.target.value)}
        />
        <IonInput
          title="email text"
          class="loginInput"
          type="email"
          placeholder="Email"
          onIonChange={(e: any) =>
            setEmail(e.target.value)}
        />
        <IonInput
          title="password text"
          class="loginInput"
          type="password"
          placeholder="Password"
          onIonChange={(e: any) => setPassword(e.target.value)}
        />
        <IonInput
          title="confirmed password text"
          class="loginInput"
          type="password"
          placeholder="Confirm Password"
          onIonChange={(e: any) => setConfirmPassword(e.target.value)}
        />
        <IonButton onClick={signupUser}>Signup</IonButton>
        <p>
          Already have an account? <IonText class="link" onClick={() => history.push("login")}>Login</IonText>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
