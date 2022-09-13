import { Container } from "@mui/material";
import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, ClientSafeProvider, signIn } from "next-auth/react";
import { AnonyButton } from "./Style/Global/AnonyButton";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignInOptions = ({ providers }: { providers: Providers }) => {
  return (
    <Container
      sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}
    >
      {Object.values(providers).map((provider) => (
        <AnonyButton
          key={provider.name}
          onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
          variant="text"
          fullWidth
          sx={{ color: "white", width: "max-content" }}
        >
          Sign in with {provider.name}
        </AnonyButton>
      ))}
    </Container>
  );
};

export default SignInOptions;
