import { firebase } from "../Firebase/firebaseConfig";
import { Toast } from './toast';

var currUser = firebase.auth().currentUser?.uid;
var db = firebase.firestore().collection("users");

export function sendFriendReq(user: any) {
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
