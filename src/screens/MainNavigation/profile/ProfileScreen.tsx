import React from "react";
import { Text, View, Button } from "react-native";
import { supabase } from "../../../lib/supabase";

// import * as Facebook from "expo-auth-session/providers/facebook";
// import auth from "expo-auth-session";

//@ts-ignore
import { REACT_APP_API_URL } from "@env";
import { ResponseType } from "expo-auth-session";

type Props = {};

function ProfileScreen({}: Props) {
  // const [request, response, promptAsync] = Facebook.useAuthRequest({
  //   clientId: "527259665535319",
  //   responseType: ResponseType.Code,
  // });

  // console.log(response);

  async function signInWithFacebook() {
    supabase.auth
      .signInWithOAuth({
        provider: "facebook",
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.error(error);
      });

    // const returnUrl = makeRedirectUri({ useProxy: false });
    // const provider = "facebook";
    // const authUrl = `${REACT_APP_API_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
    // console.log(authUrl);
  }

  // async function signout() {
  //   const { error } = await supabase.auth.signOut();
  // }

  // React.useEffect(() => {
  //   supabase.auth.getSession().then((data) => {
  //     console.log(data);
  //   });
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log(session);
  //   });
  // });

  return (
    <View>
      <Text>Profile</Text>
      <Button
        title="Facebook Login"
        onPress={() => {
          signInWithFacebook();
        }}
      ></Button>
    </View>
  );
}

export default ProfileScreen;
