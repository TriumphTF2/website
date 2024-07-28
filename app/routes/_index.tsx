import type { MetaFunction } from "@remix-run/node";
import { Await, defer, useLoaderData } from "@remix-run/react";
import { GameDig, Player, QueryResult } from "gamedig";
import { Suspense } from "react";
import { Server, ServerSkeleton } from "~/components/Server";

export const meta: MetaFunction = () => {
  return [
    { title: "TriumphTF2" },
    { name: "description", content: "TriumphTF2 Main Page" },
  ];
};

export async function loader() {
  const triumph1 = GameDig.query({
    type: "teamfortress2",
    host: "triumphtf2.com",
    port: 27015,
    maxRetries: 1,
    attemptTimeout: 3000,
  })
  const triumph2 = GameDig.query({
    type: "teamfortress2",
    host: "triumphtf2.com",
    port: 27016,
    maxRetries: 1,
    attemptTimeout: 3000,
  })

  const triumphNA = GameDig.query({
    type: "teamfortress2",
    host: "na.triumphtf2.com",
    port: 25585,
    maxRetries: 1,
    attemptTimeout: 3000,
  })
  return defer({
    triumph1: triumph1,
    triumph2: triumph2,
    triumphNA: triumphNA,
  });
}

export default function Index() {
  const { triumph1, triumph2, triumphNA } = useLoaderData<typeof loader>();
  const errorProps = {} as QueryResult;
  errorProps.name = "Server Offline";
  errorProps.numplayers = 0;
  errorProps.maxplayers = 0;
  errorProps.map = "Unknown";
  errorProps.players = [] as Player[];
  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold">TriumphTF2 Servers</h1>

        <div className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 justify-center gap-2">
          <Suspense fallback={<ServerSkeleton />}>
            <Await resolve={triumph1} errorElement={<Server {...errorProps} />}>
              {(triumph1) => (
                <Server {...triumph1} />
              )}
            </Await>
          </Suspense>
          <Suspense fallback={<ServerSkeleton />}>
            <Await resolve={triumph2} errorElement={<Server {...errorProps} />}>
              {(triumph2) => (
                <Server {...triumph2} />
              )}
            </Await>
          </Suspense>
          <Suspense fallback={<ServerSkeleton />}>
            <Await resolve={triumphNA} errorElement={<Server {...errorProps} />}>
              {(triumphNA) => (
                <Server {...triumphNA} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
