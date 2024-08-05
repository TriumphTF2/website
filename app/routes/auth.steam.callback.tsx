import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
    return authenticator.authenticate('steam', request, {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    });
}
