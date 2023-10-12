import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonImg,
  IonText,
  IonItem,
  IonButton,
  IonAlert,
} from "@ionic/react";
import { Plugins, CameraResultType } from '@capacitor/core';
import { firebase } from '../Firebase/firebaseConfig';
import { useHistory } from "react-router";
import { Toast } from "../components/toast";

const Settings: React.FC = () => {
  const history = useHistory();

  var db = firebase.firestore();
  var uid = firebase.auth().currentUser?.uid;
  var storageRef = firebase.storage().ref(uid);

  const [image, setImage] = useState("../assets/person.png");
  const [current, setCurrent] = useState("../assets/person.png");

  const [alert, setAlert] = useState(false);

  const { Camera } = Plugins;

  useEffect(() => {
    db.collection("users").doc(uid).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        setImage(data.url);
        setCurrent(data.url);
      }
    })
  }, []);

  async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    })

    var imageUrl = image.dataUrl;

    if (imageUrl)
      setImage(imageUrl);
  }

  function uploadToFirebase() {
    let uploadTask = storageRef.putString(image, "data_url");

    uploadTask.on("state_changed", (snapshot: any) => {
      console.log("Progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    },
      error => {
        console.log(error);
      },
      () => {
        if (uid) {
          uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
            db.collection("users").doc(uid).update({ url });
          })
        }
      }
    )
  }

  async function logout() {
    try {
      await firebase.auth().signOut();
      Toast("Logout Successfully.");
    } catch (e) {
      Toast(e);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonItem class="topmargin" lines="none">
          <IonButton style={{ position: "fixed", left: 0 }} fill="clear" onClick={() => history.goBack()}>
            <IonImg style={{ width: 45, height: 45 }} src={"../../assets/pinkGoBack.png"} />
          </IonButton>

          <IonText class="settingHeaderText">Edit Profile</IonText>

          <IonButton id="logout" style={{ position: "fixed", right: 0 }} fill="clear" onClick={logout}>
            <IonImg style={{ width: 25, height: 25 }} src={"../assets/exit.png"} />
          </IonButton>
        </IonItem>
      </IonHeader>

      <IonContent class="ionContent">

        <IonImg class="avatar" src={image ? image : ("../assets/person.png")}></IonImg>

        <IonItem lines="none">
          <IonText class="link" onClick={takePicture}>Edit picture</IonText>
        </IonItem>

        <IonButton class="confirm" onClick={() => setAlert(true)}>
          Confirm changes
        </IonButton>

        <IonAlert
          cssClass='alert'
          isOpen={alert}
          onDidDismiss={() => setAlert(false)}
          header={'Confirm changes?'}
          message={'Are you sure you want to confirm these changes?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                return;
              }
            },
            {
              text: 'Yes',
              handler: () => {
                if (current !== image) {
                  uploadToFirebase();
                  history.push("/tabs/tab1")
                } else {
                  Toast("No Changes made")
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
