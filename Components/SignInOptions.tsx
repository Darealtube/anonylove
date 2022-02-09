import { Box, Button } from "@mui/material";
import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, ClientSafeProvider, signIn } from "next-auth/react";
import styles from "../styles/Login.module.css";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignInOptions = ({ providers }: { providers: Providers }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      {Object.values(providers).map((provider) => (
        <Button
          key={provider.name}
          onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
          variant="text"
          fullWidth
          className={styles.loginbutton}
        >
          Sign in with {provider.name}
        </Button>
      ))}
    </Box>
  );
};

export default SignInOptions;
