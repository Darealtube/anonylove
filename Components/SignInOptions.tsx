import { Box } from "@mui/material";
import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, ClientSafeProvider, signIn } from "next-auth/react";
import { AnonyButton } from "./Style/Global/AnonyButton";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignInOptions = ({ providers }: { providers: Providers }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      {Object.values(providers).map((provider) => (
        <AnonyButton
          key={provider.name}
          onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
          variant="text"
          fullWidth
          sx={{ color: "white" }}
        >
          Sign in with {provider.name}
        </AnonyButton>
      ))}
    </Box>
  );
};

export default SignInOptions;
