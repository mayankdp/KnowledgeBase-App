import React, { useState, useEffect, createContext } from "react";
import { act } from "react-dom/test-utils";
import { firebase } from "../Firebase/firebaseConfig";
import SignInRoute from "./SignInRoute";
import SignOutRoute from "./SignOutRoute";

export const AuthContext = createContext(null);

export default function AuthNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(result: any) {
    act(() => {
      setInitializing(true);
      setUser(result);
      if (initializing) setInitializing(false);
    });
  }

  useEffect(() => {
    const authSubscriber = firebase
      .auth()
      .onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return authSubscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return user ? (
    <AuthContext.Provider value={user}>
      <SignInRoute />
    </AuthContext.Provider>
  ) : (
      <SignOutRoute />
    );
}
