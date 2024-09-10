import { useEffect } from 'react';

import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";

import * as firebaseui from "firebaseui";

import "firebaseui/dist/firebaseui.css";
import { app } from "./firebase";

export default function Login() {
    useEffect(() => {
        const ui =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(getAuth(app));

        ui.start("#firebaseui-auth-container", {
            signInSuccessUrl: "/home",
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    clientId: "861504170376-bappaoef2b2bdq3q7piqi9fmqs46jnlc.apps.googleusercontent.com"
                },
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    //requireDisplayName: true,
                }
            ],

            //used for auto sign in
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        });
    }, []);

    return <div id="firebaseui-auth-container"></div>;
}