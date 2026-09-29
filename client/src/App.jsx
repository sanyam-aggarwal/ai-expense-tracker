import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { GOOGLE_CLIENT_ID } from "./config/env";
import AppRouter from "./app/router";

export default function App() {
  const application = (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
  if (!GOOGLE_CLIENT_ID) return application;
  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{application}</GoogleOAuthProvider>;
}
