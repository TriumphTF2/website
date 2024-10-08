import React from 'react';
import { QueryResult } from 'gamedig';

export const Server: React.FC<QueryResult> = (props) => {
    // Implement your component logic here
    const getColorForPlayercount = (num: number, max: number) => {
        if(max === 0) {
            return 'dark:text-gray-600 text-gray-400'; // Escape divide by 0
        }
        if(num === 0) {
            return 'dark:text-blue-600 text-blue-400'; // Escape divide by 0
        }
        const factor = num / max;
        if (factor > 0.75) {
            return 'dark:text-red-600 text-red-400';
        } else if (factor > 0.5) {
            return 'dark:text-yellow-600 text-red-400';
        } else if (factor > 0.25) {
            return 'dark:text-green-600 text-green-400';
        } else {
            return 'dark:text-blue-600 text-blue-400';
        }
    };
    const secondsToHumanReadable = (seconds: number | undefined) => {
        if (seconds === undefined) {
            return '00:00';
        }
        seconds = Math.floor(seconds); // given as a float, handle as an int

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;


        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        if (hours > 0) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    const connectTo = (props: QueryResult) => {
        return () => {
            if (props.numplayers == props.maxplayers && props.maxplayers == 0) {
                return;
            }
            if (props.connect) {
//                 window.prompt(`We are about to use the following Steam URI to connect to the server

// steam://connect/${props.connect}

// Your browser may ask you to allow us to do this.
// If it does not allow this, here is the connect string.`, `connect ${props.connect};`);
                window.open(`steam://connect/${props.connect}`);
            }
        }
    }
    return (
        <div className='rounded-lg border border-primary dark:border-secondary bg-primary dark:bg-card text-primary-foreground dark:text-primary font-bold sm:shadow w-full max-w-md'>
            <div className="flex-col space-y-1.5 p-6 bg-card-foreground dark:bg-muted dark:text-black text-white px-4 py-3 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                    >
                        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                        <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                        <line x1="6" x2="6.01" y1="6" y2="6"></line>
                        <line x1="6" x2="6.01" y1="18" y2="18"></line>
                    </svg>
                    <div className='font-bold text-ellipsis overflow-clip text-nowrap max-w-xs'>{props.name || 'SERVERNAME'}</div>
                </div>
                <div className='text-sm text-gray-500'>
                    <span className='font-medium'>Map: {props.map || 'MAPNAME'}</span>
                </div>
                <div className='mt-4 text-sm text-white hidden sm:block'>
                    <button onClick={connectTo(props)} className={`${props.maxplayers == 0 ? 'bg-gray-500 hover:bg-gray-500 cursor-default' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded`}>
                        {
                            props.numplayers == props.maxplayers && props.maxplayers == 0 ? 'Offline' :
                            props.numplayers == props.maxplayers && props.maxplayers != 0 ? 'Full' :
                            'Connect'
                        }
                    </button>
                </div>
            </div>
            <div className='p-4 flex flex-col h-full'>
                <div className='flex items-center justify-between mb-4 h-min flex-shrink'>
                    <div className='text-2xl font-bold'>
                        <span className={getColorForPlayercount(props.numplayers || 0,props.maxplayers || 0)}>{props.numplayers || 0}</span> / {props.maxplayers || 0}
                    </div>
                    <div className='text-sm text-gray-500'>Players Online</div>
                </div>
                <div className='max-h-52 overflow-y-auto flex-grow'>
                    <div className='space-y-1 px-3.5'>
                        {props.players?.map((player) => (
                            <div key={player.name} className='flex items-center justify-between text-sm'>
                                <div className='flex items-center gap-2'>
                                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                                        <svg className='aspect-square h-full w-full' fill='none' viewBox='0 0 32 32' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z' />
                                        </svg>
                                    </span>
                                    <div>{player.name}</div>
                                </div>
                                <div className='text-gray-500 flex items-center'>{secondsToHumanReadable((player.raw as { time?: number })?.time) /* This is stupid */}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='text-center align-bottom bottom-0 h-min flex-shrink'>
                    <span className='text-sm text-muted-foreground connect-string'>{props.connect ? `connect ${props.connect};` : ''}</span>
                </div>
            </div>
        </div>
    );
};

export const ServerSkeleton: React.FC = () => {
    const randomUsername = () => {
        const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White', 'Gray', 'Brown'];
        const nouns = ['Dog', 'Cat', 'Bird', 'Fish', 'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Chicken'];
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    }
    const players = [] as string[];
    for (let i = 0; i < 8; i++) {
        players.push(randomUsername())
    }
    return (
        <div className='server-placeholder rounded-lg border border-primary dark:border-secondary bg-primary dark:bg-card text-primary-foreground dark:text-primary font-bold sm:shadow w-full max-w-md'>
            <div className="flex-col space-y-1.5 p-6 bg-card-foreground dark:bg-muted dark:text-black text-white px-4 py-3 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                    >
                        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                        <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                        <line x1="6" x2="6.01" y1="6" y2="6"></line>
                        <line x1="6" x2="6.01" y1="18" y2="18"></line>
                    </svg>
                    <div className={`text-lg font-bold`}><span className='header  bg-secondary dark:bg-primary'></span></div>
                </div>
                <div className='text-sm text-gray-500'>
                    <span className='font-medium'>Map: <span className='text  bg-secondary dark:bg-primary'></span></span>
                </div>
                <div className='mt-4 text-sm text-white hidden sm:block'>
                    <button disabled className='bg-gray-500 text-white font-bold py-2 px-4 rounded'>
                        <span className='text  bg-secondary dark:bg-primary'></span>
                    </button>
                </div>
            </div>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='font-bold'>
                        <span className='number bg-secondary dark:bg-primary'></span>
                    </div>
                    <div className='text-sm text-gray-500'>Players Online</div>
                </div>
                <div className='max-h-52 overflow-y-auto'>
                    <div className='space-y-1 px-3.5'>
                        {players.map((_,index) => (
                            <div key={index} className='flex items-center justify-between text-sm'>
                                <div className='flex items-center gap-2'>
                                    {/* <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                                        <svg className='aspect-square h-full w-full' fill='none' viewBox='0 0 32 32' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z' />
                                        </svg>
                                    </span> */}
                                    <div><span className='text bg-secondary dark:bg-primary' style={{ minWidth: `${Math.floor(Math.random() * (125 - 80 + 1)) + 80}px` }}></span></div>
                                </div>
                                <div className='text-gray-500 flex items-center'><span className='text-short'></span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
