import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonItem,
  IonPage,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonAvatar,
  IonText,
  IonHeader,
} from "@ionic/react";
import './Styles.css';
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from "../../components/toast";
import { useHistory } from "react-router";

const Leaderboard: React.FC = () => {
  const history = useHistory();
  const emptyarr: any = []
  const [userList, setUserList] = useState(emptyarr);

  var currUser = firebase.auth().currentUser?.uid;
  var db = firebase.firestore().collection("users");

  useEffect(() => {
    var userList: Array<any> = [];
    var fndList: Array<any> = [];
    var friendList: Array<any> = [];

    db.doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        fndList = data.friends;
      }
      if (fndList != null) {
        for (let friend of fndList) {
          if (friend.status === "Friends") {
            friendList.push(friend.uid);
          }
        }
      }

      db.onSnapshot(function (querySnapshot) {
        userList = [];
        querySnapshot.forEach(function (doc) {
          var list = doc.data();
          var bool = false;

          for (let f of friendList) {
            if (f === list.uid) {
              bool = true;
            }
          }
          if (currUser === list.uid) {
            bool = true;
          }
          if (list) {
            userList.push({
              username: list.username,
              score: list.score,
              url: list.url,
              uid: list.uid,
              friends: list.friends,
              bool: bool
            });
          }
        });
        userList.sort((a, b) => (a.score < b.score) ? 1 : -1);
        setUserList(userList);
      });
    });

    // db.get().then(function (querySnapshot) {
    //   userList = [];
    //   querySnapshot.forEach(function (doc) {
    //     var list = doc.data();
    //     var bool = false;

    //     for (let f of friendList) {
    //       if (f === list.uid) {
    //         bool = true;
    //       }
    //     }
    //     if (currUser === list.uid) {
    //       bool = true;
    //     }
    //     if (list) {
    //       userList.push({
    //         username: list.username,
    //         score: list.score,
    //         url: list.url,
    //         uid: list.uid,
    //         friends: list.friends,
    //         bool: bool
    //       });
    //     }
    //   });
    //   userList.sort((a, b) => (a.score < b.score) ? 1 : -1);
    //   setUserList(userList);
    // });
  }, []);

  function sendFriendReq(user: any) {
    var bool = true;
    var listOfFriends: Array<any> = [];

    db.doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        listOfFriends = data.friends;
      }
      if (listOfFriends != null) {
        for (let friend of listOfFriends) {
          if (friend.going_uid === user.uid) {
            bool = false;
          }
        }
      }
    });
    setTimeout(function () {
      if (bool) {

        if (user.uid === currUser) {
          Toast("You cannot send friend request to your self!")
        } else {
          db.doc(currUser).update({
            friends: firebase.firestore.FieldValue.arrayUnion({
              username: user.username,
              going_uid: user.uid,
              status: "requestSentTo",
            })
          })
          db.doc(currUser).get().then(function (doc) {
            var data = doc.data();
            if (data) {
              db.doc(user.uid).update({
                friends: firebase.firestore.FieldValue.arrayUnion({
                  username: data.username,
                  coming_uid: currUser,
                  status: "requestReceivedFrom",
                })
              })
            }
          })

          Toast("Friend Request Sent!");
        }
      } else {
        Toast("Friend Request Already Sent!");
      }
    }, 1000);
  }

  function userPage(user: any) {
    history.push("/User", user);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonItem lines='full'>
          <IonText class='header_list'>Username</IonText>
          <IonText slot='end' class='header_score'>Score</IonText>
        </IonItem>
      </IonHeader>

      <IonContent className='padding' class='ionContent'>
        <IonList>
          {userList.map((user: any, index: any) => {
            return (
              <IonItemSliding key={index}>
                <IonItem lines="none" class='fql_item' onClick={() => userPage(user)}>
                  <IonAvatar slot='start'>
                    <img src={user.url ? user.url : ("../assets/person.png")} />
                  </IonAvatar>
                  <IonText class='fql_name'>{user.username}</IonText>

                  <IonText class='fql_name' slot='end'>{user.score}</IonText>
                </IonItem>

                {!user.bool ? (
                  < IonItemOptions side="end">
                    <IonItemOption onClick={() => sendFriendReq(user)}>Add Friend</IonItemOption>
                  </IonItemOptions>
                ) : null}

              </IonItemSliding>
            )
          })}
        </IonList>
      </IonContent>

    </IonPage >
  );
};
export default Leaderboard;
