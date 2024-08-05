import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, type MetaFunction } from "@remix-run/react";
import { authenticator } from "~/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: 'TriumphTF2 - Dashboard' },
        { description: 'Your dashboard' },
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    const auth = await authenticator.isAuthenticated(request);
    if (auth == null) {
        await authenticator.authenticate('steam', request, {
            successRedirect: '/dashboard',
            failureRedirect: '/',
        });
    }
    return {auth: auth};
}

export default function Dashboard() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    if (data.auth == null) {
        navigate('/');
        return <></>;
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {data.auth.nickname}!</p>
            <p>This is a placeholder page. More content to come!</p>
            <Link to="/auth/logout">Logout</Link> - <Link to="/">Home</Link>
        </div>
    );
}
